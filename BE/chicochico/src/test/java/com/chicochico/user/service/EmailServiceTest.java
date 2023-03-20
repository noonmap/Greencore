package com.chicochico.user.service;


import com.chicochico.domain.user.service.EmailService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

	private EmailService emailService;

	@Nested
	@DisplayName("인증 이메일을 발송")
	class 이메일인증발송 {

		@Test
		@DisplayName("인증 이메일을 발송 성공")
		public void test1() {

		}


		@Test
		@DisplayName("인증 이메일 발송 실패")
		public void test2() {

		}

	}

	@Nested
	@DisplayName("이메일 인증 확인")
	class 이메일인증확인 {

		@Test
		@DisplayName("이메일 인증 실패 - 인증코드가 맞지 않는 경우")
		public void test1() {

		}


		@Test
		@DisplayName("이메일 인증 성공")
		public void test2() {

		}

	}

}
