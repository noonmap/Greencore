package com.chicochico.domain.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthTokenProvider;
import com.chicochico.domain.user.dto.request.LoginRequestDto;
import com.chicochico.domain.user.dto.response.ProfileSimpleResponseDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static com.chicochico.exception.ErrorCode.PASSWORD_NOT_MATCH;
import static com.chicochico.exception.ErrorCode.USER_NOT_FOUND;


@Log4j2
@Service
@RequiredArgsConstructor
public class LoginService {

	private final AuthTokenProvider authTokenProvider;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final RedisTemplate<String, String> redisTemplate;


	/**
	 * 엑세스 토큰을 재발급합니다
	 *
	 * @param loginRequestHeader 엑세스 토큰
	 * @param response           엑세스 토큰을 담을 response
	 */
	public void createAccessToken(Map<String, String> loginRequestHeader, HttpServletResponse response) {

		String loginRequestRefreshToken = getHeader(loginRequestHeader, "x-refresh-token");
		String accessToken = extractAccessToken(getHeader(loginRequestHeader, "authorization"));

		// 1. Refresh Token 검증
		if (!authTokenProvider.validate(loginRequestRefreshToken)) {
			// Refresh Token 정보가 유효하지 않습니다.
			throw new CustomException(ErrorCode.REFRESH_TOKEN_ERROR);
		}

		// 2. AccessToken에서 UserId와 UserNickname 가져옵니다.
		Long userId = authTokenProvider.getUserId(accessToken);
		String userNickname = authTokenProvider.getUserNickname(accessToken);

		// 3. Redis 에서 UserId 을 기반으로 저장된 Refresh Token 값을 가져옵니다.
		String refreshToken = redisTemplate.opsForValue().get("RT:" + userId);
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
		redisTemplate.opsForValue()
			.set("RT:" + userId, newRefreshToken, authTokenProvider.getExpiration(refreshToken), TimeUnit.MILLISECONDS);

	}


	/**
	 * 로그인을 수행합니다
	 *
	 * @param loginRequestDto 이메일과 비밀번호 (email, password)
	 * @param response        엑세스 토큰을 담을 response
	 * @return 간단한 로그인 유저 프로필
	 */
	public ProfileSimpleResponseDto login(LoginRequestDto loginRequestDto, HttpServletResponse response) {

		// 유저 존재 확인
		Optional<UserEntity> user = userRepository.findByEmail(loginRequestDto.getEmail());

		if (user.isEmpty() || user.get().getIsDeleted().equals(IsDeletedType.Y)) {
			// 유저가 존재하지 않을 때 혹은 탈퇴한 유저 일때 error 발생
			throw new CustomException(USER_NOT_FOUND);
		}

		log.info("[login] 비밀번호 비교 수행");
		// 비밀번호 체크
		if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.get().getPassword())) {
			throw new CustomException(PASSWORD_NOT_MATCH);
		}

		log.info("[login] 비밀번호 패스워드 일치");

		log.info("[login] 토큰 생성 및 응답");

		// 토큰 생성 및 응답
		String accessToken = authTokenProvider.createAccessToken(user.get().getId(), user.get().getNickname());
		String refreshToken = authTokenProvider.createRefreshToken(user.get().getId(), user.get().getNickname());
		authTokenProvider.setHeaderAccessToken(response, accessToken);
		authTokenProvider.setHeaderRefreshToken(response, refreshToken);

		// refresh token Redis에 저장
		redisTemplate.opsForValue().set("RT:" + user.get().getId(), refreshToken, authTokenProvider.getExpiration(refreshToken), TimeUnit.MILLISECONDS);

		return ProfileSimpleResponseDto.fromEntity(user.get());
	}


	/**
	 * 깃허브로그인을 수행합니다
	 *
	 * @param loginRequestHeader 이메일과 비밀번호 (email, password)
	 * @param response           엑세스 토큰을 담을 response
	 */
	public void githubLogin(Map<String, Object> loginRequestHeader, HttpServletResponse response) {
	}


	/**
	 * 로그아웃합니다 (엑세스 토큰 삭제)
	 *
	 * @param logoutRequestHeader 엑세스 토큰
	 */
	public void deleteAccessToken(Map<String, String> logoutRequestHeader) {

		// 1. Access Token 검증
		String accessToken = extractAccessToken(getHeader(logoutRequestHeader, "authorization"));

		if (!authTokenProvider.validate(accessToken)) {
			throw new CustomException(ErrorCode.ACCESS_TOKEN_ERROR);
		}

		// 2. Access Token 에서 User id 을 가져옵니다.
		Long userId = authTokenProvider.getUserId(accessToken);

		// 3. Redis 에서 해당 User id 로 저장된 Refresh Token 이 있는지 여부를 확인 후 있을 경우 삭제합니다.
		if (redisTemplate.opsForValue().get("RT:" + userId) != null) {
			// Refresh Token 삭제
			redisTemplate.delete("RT:" + userId);
		}

		// 4. 해당 Access Token 유효시간 가지고 와서 BlackList 로 저장하기
		Long expiration = authTokenProvider.getExpiration(accessToken);
		redisTemplate.opsForValue()
			.set(accessToken, "logout", expiration, TimeUnit.MILLISECONDS);

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
