package com.chicochico.user.service;


import com.chicochico.common.service.AuthTokenProvider;
import com.chicochico.domain.user.dto.LoginRequestDto;
import com.chicochico.domain.user.dto.ProfileSimpleResponseDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.domain.user.service.LoginService;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.servlet.http.HttpServletResponse;
import java.util.Optional;


class LoginServiceTest {

	private final Logger LOGGER = LoggerFactory.getLogger(LoginServiceTest.class);

	private final String testNickname = "test";
	private final String testEmail = "test@naver.com";
	private final String testPassword = "1234";
	HttpServletResponse httpServletResponse = new MockHttpServletResponse();
	private PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
	private AuthTokenProvider authTokenProvider = Mockito.mock(AuthTokenProvider.class);
	private UserRepository userRepository = Mockito.mock(UserRepository.class);
	private LoginService loginService;


	@BeforeEach
	public void setUpTest() {
		loginService = new LoginService(authTokenProvider, userRepository, passwordEncoder);
	}


	@Test
	@DisplayName("로그인 - 유저가 존재 하지 않음 (email not found)")
	void loginTest_이메일없음() {
		// given
		Optional<UserEntity> givenUser = Optional.empty();
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenUser);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
			loginService.login(new LoginRequestDto("123", "1234"), httpServletResponse);
		});

		// then
		Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		//		assertThatThrownBy(() -> loginService.login(new LoginRequestDto("123", "1234"), httpServletResponse)).isInstanceOf(CustomException.class);

	}


	@Test
	@DisplayName("로그인 실패 - 이메일 존재 비밀번호 불일치 (password not match)")
	void loginTest_로그인실패비밀번호불일치() {
		// given
		Optional<UserEntity> givenUser = Optional.of(UserEntity.builder().email(testEmail)
			.password("$2a$10$RSCiBg7XpDF.64K24OpIFeXh9QJItoKbGMjy73u9v82JyUSbF.pim")
			.nickname(testNickname).build());
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenUser);
		LOGGER.info("[로그인 - 실패] {}", userRepository.findByEmail(testEmail));

		LoginRequestDto loginRequestDto = new LoginRequestDto(testEmail, testPassword);

		Mockito.when(passwordEncoder.matches(loginRequestDto.getPassword(), givenUser.get().getPassword())).thenReturn(false);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
			loginService.login(loginRequestDto, httpServletResponse);
		});

		// then
		Assertions.assertEquals(ErrorCode.PASSWORD_NOT_MATCH, customException.getErrorCode());
	}


	@Test
	@DisplayName("로그인 - 성공")
	void loginTest_로그인성공() {
		// given
		Optional<UserEntity> givenUser = Optional.of(UserEntity.builder().email(testEmail)
			.password("$2a$10$RSCiBg7XpDF.64K24OpIFeXh9QJItoKbGMjy73u9v82JyUSbF.pim")
			.nickname(testNickname).build());
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenUser);
		LOGGER.info("[로그인 - 성공] {}", userRepository.findByEmail(testEmail));

		LoginRequestDto loginRequestDto = new LoginRequestDto(testEmail, testPassword);

		Mockito.when(passwordEncoder.matches(loginRequestDto.getPassword(), givenUser.get().getPassword())).thenReturn(true);

		// when
		//		Assertions.assertThatCode(() -> {
		//			loginService.login(loginRequestDto, new Response());
		//		}).doesNotThrowAnyException();

		ProfileSimpleResponseDto profileSimpleResponseDto = loginService.login(loginRequestDto, httpServletResponse);

		// then
		Assertions.assertEquals(profileSimpleResponseDto.getNickname(), givenUser.get().getNickname());
		Assertions.assertEquals(profileSimpleResponseDto.getProfileImagePath(), givenUser.get().getProfileImagePath());

	}


	@Disabled
	@Test
	void githubLogin() {
	}


	@Disabled
	@Test
	void createAccessToken() {
	}


	@Disabled
	@Test
	void deleteAccessToken() {
	}

}