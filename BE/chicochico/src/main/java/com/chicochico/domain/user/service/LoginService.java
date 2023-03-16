package com.chicochico.domain.user.service;


import com.chicochico.common.dto.ResultDto;
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
import org.springframework.security.core.context.SecurityContextHolder;
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
	 * 로그인을 수행합니다
	 *
	 * @param loginRequestDto 이메일과 비밀번호 (email, password)
	 * @param response        엑세스 토큰을 담을 response
	 */
	public ProfileSimpleResponseDto login(LoginRequestDto loginRequestDto, HttpServletResponse response) {

		// 유저 존재 확인
		Optional<UserEntity> user = userRepository.findByEmail(loginRequestDto.getEmail());

		if (user.isEmpty()) {
			// 유저가 존재하지 않을 때 error 발생
			throw new CustomException(USER_NOT_FOUND);
		}

		log.info("[login] email : {}", user.get().getEmail());

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
	 * 엑세스 토큰을 재발급합니다
	 *
	 * @param loginRequestHeader 엑세스 토큰
	 * @param response           엑세스 토큰을 담을 response
	 */
	public void createAccessToken(Map<String, Object> loginRequestHeader, HttpServletResponse response) {
		// 어세스, 리프레시 토큰 발급 및 헤더 설정 (아래는 진행 예시)
		//	String accessToken = jwtTokenProvider.createAccessToken(member.getEmail(), member.getRoles());
		//	String refreshToken = jwtTokenProvider.createRefreshToken(member.getEmail(), member.getRoles());
		//	jwtTokenProvider.setHeaderAccessToken(response, accessToken);
		//	jwtTokenProvider.setHeaderRefreshToken(response, refreshToken);
	}


	/**
	 * 로그아웃합니다 (엑세스 토큰 삭제)
	 *
	 * @param logoutRequestHeader 엑세스 토큰
	 */
	public ResultDto<Boolean> deleteAccessToken(Map<String, String> logoutRequestHeader) {

		if (!logoutRequestHeader.containsKey("authorization")) {
			throw new CustomException(ErrorCode.ACCESS_TOKEN_NOT_FOUND);
		}

		String bearerToken = logoutRequestHeader.get("authorization");

		// 1. Access Token 검증
		String accessToken;
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			accessToken = bearerToken.substring(7);
		} else {
			throw new CustomException(ErrorCode.ACCESS_TOKEN_ERROR);
		}

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
		SecurityContextHolder.clearContext();

		return ResultDto.ofSuccess();
	}

}
