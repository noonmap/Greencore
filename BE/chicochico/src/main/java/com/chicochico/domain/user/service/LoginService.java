package com.chicochico.domain.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.UserStoreType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.AuthTokenProvider;
import com.chicochico.common.service.OauthService;
import com.chicochico.common.service.RedisService;
import com.chicochico.domain.user.dto.request.LoginRequestDto;
import com.chicochico.domain.user.dto.request.RefreshRequestDto;
import com.chicochico.domain.user.dto.response.ProfileSimpleResponseDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;

import static com.chicochico.exception.ErrorCode.PASSWORD_NOT_MATCH;
import static com.chicochico.exception.ErrorCode.USER_NOT_FOUND;


@Log4j2
@Service
@RequiredArgsConstructor
public class LoginService {

	private final AuthTokenProvider authTokenProvider;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final RedisService redisService;
	private final FirebaseAuth firebaseAuth;
	private final OauthService oauthService;
	private final ObjectMapper objectMapper;
	private final AuthService authService;


	/**
	 * 엑세스 토큰을 재발급합니다
	 *
	 * @param loginRequestHeader 엑세스 토큰
	 * @param response           엑세스 토큰을 담을 response
	 */
	public void createAccessToken(Map<String, String> loginRequestHeader, HttpServletResponse response, RefreshRequestDto refreshRequestDto) {

		// 로그인 유저 가져오기

		String loginRequestRefreshToken = getHeader(loginRequestHeader, "x-refresh-token");
		UserStoreType userStore = refreshRequestDto.getAuthType();

		if (userStore.equals(UserStoreType.DB)) { // 로그인 유저가 db 유저라면

			// 1. Refresh Token 검증
			if (!authTokenProvider.validate(loginRequestRefreshToken)) {
				// Refresh Token 정보가 유효하지 않습니다.
				throw new CustomException(ErrorCode.REFRESH_TOKEN_ERROR);
			}

			// 2. Refresh Token에서 UserId와 UserNickname 가져옵니다.
			Long userId = authTokenProvider.getUserId(loginRequestRefreshToken);
			String userNickname = authTokenProvider.getUserNickname(loginRequestRefreshToken);

			// 3. Redis 에서 UserId 을 기반으로 저장된 Refresh Token 값을 가져옵니다.
			String refreshToken = redisService.getData("RT:" + userId);
			if (!StringUtils.hasText(refreshToken) || !refreshToken.equals(loginRequestRefreshToken)) {
				// Refresh Token 정보가 일치하지 않습니다.
				throw new CustomException(ErrorCode.REFRESH_TOKEN_ERROR);
			}

			// 4. 새로운 토큰 생성
			String newAccessToken = authTokenProvider.createAccessToken(userId, userNickname);
			String newRefreshToken = authTokenProvider.createRefreshToken(userId, userNickname);
			authTokenProvider.setHeaderAccessToken(response, newAccessToken);
			authTokenProvider.setHeaderRefreshToken(response, newRefreshToken);

			// 5. RefreshToken Redis 업데이트
			redisService.setDataExpireMilliseconds("RT:" + userId, newRefreshToken, authTokenProvider.getExpiration(refreshToken));

		} else if (userStore.equals(UserStoreType.FIREBASE)) { // firebase에 저장된 유저 (구글/깃헙)
			Map<String, String> params = new HashMap<>();
			params.put("refresh_token", loginRequestRefreshToken);

			// 새 access 토큰 생성
			String result = oauthService.firebaseRefreshToken(params);
			JsonNode jsonNode = null;
			try {
				jsonNode = objectMapper.readTree(result);
			} catch (JsonProcessingException e) {
				throw new CustomException(ErrorCode.TOKEN_ERROR);
			}
			// 새로운 토큰 header에 넣기
			String newAccessToken = oauthService.getStringValue(jsonNode, "id_token");
			authTokenProvider.setHeaderAccessToken(response, newAccessToken);
			authTokenProvider.setHeaderRefreshToken(response, loginRequestRefreshToken);

		} else if (userStore.equals(UserStoreType.KAKAO)) { // kakao 로그인 유저
			Map<String, String> params = new HashMap<>();
			params.put("refresh_token", loginRequestRefreshToken);

			// 새 access 토큰 생성
			String result = oauthService.kakaoRefreshToken(params);
			JsonNode jsonNode = null;
			try {
				jsonNode = objectMapper.readTree(result);
			} catch (JsonProcessingException e) {
				throw new CustomException(ErrorCode.TOKEN_ERROR);
			}

			String newAccessToken = oauthService.getStringValue(jsonNode, "access_token");

			// 새 access token header 에 담기, 이전 refreshToken 다시 담아서 전달
			// refreshToken 만료시 에러 발생 -> 다시 로그인해야함
			authTokenProvider.setHeaderAccessToken(response, newAccessToken);
			authTokenProvider.setHeaderRefreshToken(response, loginRequestRefreshToken);

		}

	}


	/**
	 * 로그인을 수행합니다
	 *
	 * @param loginRequestDto 이메일과 비밀번호 (email, password)
	 * @param response        엑세스 토큰을 담을 response
	 * @return 간단한 로그인 유저 프로필
	 */
	public ProfileSimpleResponseDto login(LoginRequestDto loginRequestDto, HttpServletResponse response) {

		// 유저가 존재하지 않을 때 혹은 탈퇴한 유저 일때 error 발생
		UserEntity user = userRepository.findByEmailAndIsDeleted(loginRequestDto.getEmail(), IsDeletedType.N).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
		System.out.println("loginRequestDto: " + loginRequestDto);

		log.info("[login] 비밀번호 비교 수행");
		// 비밀번호 체크
		if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
			throw new CustomException(PASSWORD_NOT_MATCH);
		}

		log.info("[login] 비밀번호 패스워드 일치");

		log.info("[login] 토큰 생성 및 응답");

		// 토큰 생성 및 응답
		String accessToken = authTokenProvider.createAccessToken(user.getId(), user.getNickname());
		String refreshToken = authTokenProvider.createRefreshToken(user.getId(), user.getNickname());
		authTokenProvider.setHeaderAccessToken(response, accessToken);
		authTokenProvider.setHeaderRefreshToken(response, refreshToken);

		// refresh token Redis에 저장
		redisService.setDataExpireMilliseconds("RT:" + user.getId(), refreshToken, authTokenProvider.getExpiration(refreshToken));
		return ProfileSimpleResponseDto.fromEntity(user);
	}


	/**
	 * Oauth 깃헙 로그인을 수행합니다
	 *
	 * @param loginRequestHeader 엑세스 토큰, 리프레시 토큰
	 * @param response
	 */
	@Transactional
	public ProfileSimpleResponseDto oauthLogin(Map<String, String> loginRequestHeader, HttpServletResponse response) {

		String loginRequestRefreshToken = getHeader(loginRequestHeader, "x-refresh-token");
		String accessToken = extractAccessToken(getHeader(loginRequestHeader, "authorization"));

		// 유저 존재 확인
		FirebaseToken decodedToken = null;
		try {
			decodedToken = firebaseAuth.verifyIdToken(accessToken);
		} catch (FirebaseAuthException e) {
			throw new CustomException(ErrorCode.ACCESS_TOKEN_ERROR);
		}

		log.info("[oauthLogin] 유저 존재 확인 완료");

		// 회원가입 되지 않은 유저인가? -> 회원가입 (email, nickname, password)
		if (userRepository.findByEmail(decodedToken.getEmail()).isEmpty()) {

			// 이미 존재하는 닉네임인지 다시 한번 확인
			if (userRepository.findByNickname(decodedToken.getName()).isPresent()) {
				throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
			}

			String nickname = decodedToken.getName() == null ? decodedToken.getUid() : decodedToken.getName();

			UserEntity userEntity = UserEntity.builder().email(decodedToken.getEmail()).nickname(nickname).password(passwordEncoder.encode(decodedToken.getUid() + "!"))
				.userStore(UserStoreType.FIREBASE)
				.build();

			userRepository.save(userEntity);
		}
		log.info("[oauthLogin] 회원가입 된 상태");

		// id를 firebase에서 제공하는 email를 사용함
		// 있는 유저라면 계속 진행하기 or 회원가입 완료 후 db에 있는 유저
		UserEntity user = userRepository.findByEmailAndIsDeleted(decodedToken.getEmail(), IsDeletedType.N).orElseThrow(() -> new CustomException(USER_NOT_FOUND));

		// 다시 동일한 accessToken, refreshToken 담기
		authTokenProvider.setHeaderAccessToken(response, accessToken);
		authTokenProvider.setHeaderRefreshToken(response, loginRequestRefreshToken);
		return ProfileSimpleResponseDto.fromEntity(user);

	}


	/**
	 * 카카오 로그인을 수행합니다.
	 *
	 * @param loginRequestHeader 엑세스 토큰, 리프레시 토큰
	 * @param response
	 * @return 사용자 정보
	 */
	@Transactional
	public ProfileSimpleResponseDto kakaoLogin(Map<String, String> loginRequestHeader, HttpServletResponse response) {
		// refresh, accessToken 토큰 꺼내기
		String loginRequestRefreshToken = getHeader(loginRequestHeader, "x-refresh-token");
		String accessToken = extractAccessToken(getHeader(loginRequestHeader, "authorization"));

		// 토큰 정보 가져오기
		oauthService.setAccessToken(accessToken);
		String result = oauthService.getKakaoUserAccessTokenInfo();

		// ACCESS_TOKEN_ERROR에 문제가 있음
		if (result == null) throw new CustomException(ErrorCode.ACCESS_TOKEN_ERROR);
		// ex) {"expiresInMillis":19207853,"id":2725166167,"expires_in":19207,"app_id":483869,"appId":483869}

		JsonObject jsonObject = new Gson().fromJson(result, JsonObject.class);
		String expiresInMillis = jsonObject.get("expiresInMillis").getAsString();

		// 유저 정보 가져오기
		String userInfo = oauthService.kakaoMe();
		// 카카오로부터 유저 정보를 가져올 수 없음
		if (userInfo == null) throw new CustomException(USER_NOT_FOUND);

		JsonNode jsonNode = null;
		try {
			jsonNode = objectMapper.readTree(userInfo);
		} catch (JsonProcessingException e) {
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		}

		JsonNode kakaoAccount = jsonNode.get("kakao_account");

		String kakaoEmail = oauthService.getStringValue(kakaoAccount, "email");
		String kakaoNickname = oauthService.getStringValue(kakaoAccount, "profile", "nickname");
		String kakaoProfileImageUrl = oauthService.getStringValue(kakaoAccount, "profile", "profile_image_url");
		String kakaoUID = oauthService.getStringValue(jsonNode, "id");

		// 회원가입 되지 않은 유저인가? -> 회원가입 (email, nickname, password)
		if (userRepository.findByEmail(kakaoEmail).isEmpty()) {

			// 이미 존재하는 닉네임인지 다시 한번 확인
			if (userRepository.findByNickname(kakaoNickname).isPresent()) {
				throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
			}

			UserEntity userEntity = UserEntity.builder().email(kakaoEmail).nickname(kakaoNickname).profileImagePath(kakaoProfileImageUrl).password(passwordEncoder.encode(kakaoUID + "!"))
				.userStore(UserStoreType.KAKAO).build();

			userRepository.save(userEntity);
		}
		log.info("[kakaoLogin] 회원가입 된 상태");

		// id를 firebase에서 제공하는 email를 사용함
		// 있는 유저라면 계속 진행하기 or 회원가입 완료 후 db에 있는 유저
		UserEntity user = userRepository.findByEmailAndIsDeleted(kakaoEmail, IsDeletedType.N).orElseThrow(() -> new CustomException(USER_NOT_FOUND));

		log.info("[kakaoLogin] 토큰 생성 및 응답 {}", expiresInMillis);

		// 다시 동일한 accessToken, refreshToken 담기
		authTokenProvider.setHeaderAccessToken(response, accessToken);
		authTokenProvider.setHeaderRefreshToken(response, loginRequestRefreshToken);

		return ProfileSimpleResponseDto.fromEntity(user);
	}


	/**
	 * 로그아웃합니다 (엑세스 토큰 삭제)
	 *
	 * @param logoutRequestHeader 엑세스 토큰
	 */
	public void deleteAccessToken(Map<String, String> logoutRequestHeader) {

		// 1. Access Token 검증은 spring security에서 진행
		String accessToken = extractAccessToken(getHeader(logoutRequestHeader, "authorization"));

		// 2. 로그인 유저 에서 User id 을 가져옵니다.

		Long userId = authService.getUserId();
		UserEntity user = userRepository.findByIdAndIsDeleted(userId, IsDeletedType.N).orElseThrow(() -> new CustomException(USER_NOT_FOUND));

		if (user.getUserStore().equals(UserStoreType.DB)) {
			// 3. Redis 에서 해당 User id 로 저장된 Refresh Token 이 있는지 여부를 확인 후 있을 경우 삭제합니다.
			if (redisService.getData("RT:" + userId) != null) {
				// Refresh Token 삭제
				redisService.deleteData("RT:" + userId);
			}

			// 4. 해당 Access Token 유효시간 가지고 와서 BlackList 로 저장하기
			Long expiration = authTokenProvider.getExpiration(accessToken);
			redisService.setDataExpireMilliseconds(accessToken, "logout", expiration);
		}

		// FIREBASE나 KAKAO는 프론트에서 로그아웃 로직 처리

	}


	private String getHeader(Map<String, String> headers, String key) {
		String value = headers.get(key);
		if (!StringUtils.hasText(value)) {
			ErrorCode errorCode = key.equals("authorization") ? ErrorCode.ACCESS_TOKEN_NOT_FOUND : ErrorCode.REFRESH_TOKEN_NOT_FOUND;
			throw new CustomException(errorCode);
		}
		return value;
	}


	private String extractAccessToken(String authorizationHeader) {
		if (!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")) {
			throw new CustomException(ErrorCode.ACCESS_TOKEN_ERROR);
		}
		return authorizationHeader.substring(7);
	}

}
