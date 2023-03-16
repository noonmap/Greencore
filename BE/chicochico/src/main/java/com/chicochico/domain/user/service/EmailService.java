package com.chicochico.domain.user.service;


import com.chicochico.domain.user.dto.request.AuthCodeRequestDto;
import com.chicochico.domain.user.dto.request.EmailRequestDto;
import com.chicochico.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EmailService {

	private final UserRepository userRepository;


	/**
	 * 인증 이메일을 발송합니다
	 *
	 * @param emailRequestDto 이메일(email)
	 */
	public void sendVerificationEmail(EmailRequestDto emailRequestDto) {
	}


	/**
	 * 이메일 인증을 확인합니다
	 *
	 * @param authCodeRequestDto 인증코드(authCode)
	 */
	public void confirmEmail(AuthCodeRequestDto authCodeRequestDto) {
	}


	/**
	 * 임시 비밀번호를 전송합니다
	 *
	 * @param emailRequestDto 이메일(email)
	 */
	public void sendTemporaryPassword(EmailRequestDto emailRequestDto) {
	}

}
