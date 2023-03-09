package com.chicochico.domain.user.service;


import com.chicochico.domain.user.dto.LoginRequestDto;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class LoginService {

	/**
	 * @param loginRequestDto 이메일과 비밀번호 (email, password)
	 */
	public void login(LoginRequestDto loginRequestDto) {
	}


	/**
	 * @param loginRequestHeader 이메일과 비밀번호 (email, password)
	 */
	public void githubLogin(Map<String, Object> loginRequestHeader) {
	}


	/**
	 * @param loginRequestHeader 엑세스 토큰
	 */
	public void createAccessToken(Map<String, Object> loginRequestHeader) {
	}

}
