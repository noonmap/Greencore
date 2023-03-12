package com.chicochico.domain.user.service;


import com.chicochico.domain.user.dto.LoginRequestDto;
import com.chicochico.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class LoginService {

	// TODO JwtTokenProvider 생성
	// private final JwtTokenProvider jwtTokenProvider;

	private final UserRepository userRepository;


	/**
	 * 로그인을 수행합니다
	 *
	 * @param loginRequestDto 이메일과 비밀번호 (email, password)
	 * @param response        엑세스 토큰을 담을 response
	 */
	public void login(LoginRequestDto loginRequestDto, HttpServletResponse response) {
		// 어세스, 리프레시 토큰 발급 및 헤더 설정 (아래는 진행 예시)
		//	String accessToken = jwtTokenProvider.createAccessToken(member.getEmail(), member.getRoles());
		//	String refreshToken = jwtTokenProvider.createRefreshToken(member.getEmail(), member.getRoles());
		//	jwtTokenProvider.setHeaderAccessToken(response, accessToken);
		//	jwtTokenProvider.setHeaderRefreshToken(response, refreshToken);
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
	}


	/**
	 * 로그아웃합니다 (엑세스 토큰 삭제)
	 *
	 * @param logoutRequestHeader 엑세스 토큰
	 */
	public void deleteAccessToken(Map<String, Object> logoutRequestHeader) {
	}

}
