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
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

	private final Logger LOGGER = LoggerFactory.getLogger(LoginServiceTest.class);

	private final String testNickname = "test";
	private final String testEmail = "test@naver.com";
	private final String testPassword = "1234";
	HttpServletResponse httpServletResponse = new MockHttpServletResponse();
	@Mock
	private PasswordEncoder passwordEncoder;
	@Mock
	private AuthTokenProvider authTokenProvider;
	@Mock
	private UserRepository userRepository;
	@Mock
	private RedisTemplate<String, String> redisTemplate;

	@Mock
	private ValueOperations<String, String> valueOperations;

	@InjectMocks
	private LoginService loginService;


	@Test
	@DisplayName("로그인 - 유저가 존재 하지 않음 (email not found)")
	void loginTest_이메일없음() {
		// given
		Optional<UserEntity> givenUser = Optional.empty();
		LoginRequestDto loginRequestDto = new LoginRequestDto("123", "1234");
		Mockito.when(userRepository.findByEmail(loginRequestDto.getEmail())).thenReturn(givenUser);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
			loginService.login(loginRequestDto, httpServletResponse);
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


	@Disabled
	@Test
	void githubLogin() {
	}


	@Disabled
	@Test
	void createAccessToken() {
	}


	@Test
	@DisplayName("로그아웃 - 실패 (엑세스 토큰 없음)")
	void deleteAccessTokenTest_로그아웃실패_ACCESS_TOKEN_NOT_FOUND() {
		// given
		Map<String, String> logoutRequestHeader = new HashMap<>();

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
			loginService.deleteAccessToken(logoutRequestHeader);
		});

		// then
		Assertions.assertEquals(ErrorCode.ACCESS_TOKEN_NOT_FOUND, customException.getErrorCode());
	}


	@Test
	@DisplayName("로그아웃 - 실패 (엑세스 토큰 유효하지않음)")
	void deleteAccessTokenTest_로그아웃실패_ACCESS_TOKEN_ERROR() {
		// given
		Map<String, String> logoutRequestHeader = new HashMap<>();
		String bearerToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuaWNrbmFtZVwiOlwidGVzdFwiLFwidG9rZW5UeXBlXCI6XCJBQ0NFU1NcIixcInVzZXJJZFwiOlwiMVwifSIsImlhdCI6MTY3ODg3NTkyOSwiZXhwIjoxNjc4ODc3NzI5fQ.T4R1WRTLR3RhN8T_Vr0nX_WH2rnFly35SYHnETZVTiY";
		logoutRequestHeader.put("authorization", bearerToken);

		Mockito.when(authTokenProvider.validate(bearerToken.substring(7))).thenReturn(false);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
			loginService.deleteAccessToken(logoutRequestHeader);
		});

		// then
		Assertions.assertEquals(ErrorCode.ACCESS_TOKEN_ERROR, customException.getErrorCode());
	}


	@Nested
	@DisplayName("redisTemplate가 필요한 test")
	class redisTemplateTest {

		@BeforeEach
		void setUpTest() {
			// mock RedisTemplate
			MockitoAnnotations.initMocks(this);
			Mockito.when(redisTemplate.opsForValue()).thenReturn(valueOperations);
			Mockito.doNothing().when(valueOperations).set(anyString(), anyString(), anyLong(), any(TimeUnit.class));
		}


		@Test
		@DisplayName("로그인 - 성공")
		void loginTest_로그인성공() {
			// given
			String email = "test@test.com";
			String password = "password";
			UserEntity user = UserEntity.builder()
				.id(1L)
				.email(email)
				.password("encoded_password")
				.nickname("test")
				.build();
			Optional<UserEntity> givenUser = Optional.of(user);

			LoginRequestDto loginRequestDto = new LoginRequestDto(email, password);

			// mock UserRepository
			when(userRepository.findByEmail(email)).thenReturn(givenUser);

			// mock PasswordEncoder
			Mockito.when(passwordEncoder.matches(loginRequestDto.getPassword(), givenUser.get().getPassword())).thenReturn(true);

			// mock AuthTokenProvider
			String accessToken = "access_token";
			String refreshToken = "refresh_token";
			when(authTokenProvider.createAccessToken(user.getId(), user.getNickname())).thenReturn(accessToken);
			when(authTokenProvider.createRefreshToken(user.getId(), user.getNickname())).thenReturn(refreshToken);

			// when
			ProfileSimpleResponseDto profileSimpleResponseDto = loginService.login(loginRequestDto, httpServletResponse);

			// then
			Assertions.assertEquals(profileSimpleResponseDto.getNickname(), givenUser.get().getNickname());
			Assertions.assertEquals(profileSimpleResponseDto.getProfileImagePath(), givenUser.get().getProfileImagePath());

			// verify UserRepository
			verify(userRepository).findByEmail(email);

			// verify AuthTokenProvider
			verify(authTokenProvider).createAccessToken(user.getId(), user.getNickname());
			verify(authTokenProvider).createRefreshToken(user.getId(), user.getNickname());
			verify(authTokenProvider).setHeaderAccessToken(httpServletResponse, accessToken);
			verify(authTokenProvider).setHeaderRefreshToken(httpServletResponse, refreshToken);

		}


		@Test
		@DisplayName("로그아웃 - 성공")
		void deleteAccessTokenTest_로그아웃성공() {
			// given
			String accessToken = "valid_access_token";
			Long userId = 123L;
			Map<String, String> logoutRequestHeader = new HashMap<>();
			logoutRequestHeader.put("authorization", "Bearer " + accessToken);
			when(authTokenProvider.validate(accessToken)).thenReturn(true);
			when(authTokenProvider.getUserId(accessToken)).thenReturn(userId);
			when(redisTemplate.opsForValue().get("RT:" + userId)).thenReturn("valid_refresh_token");

			/// when // then
			assertThatCode(() -> {
				loginService.deleteAccessToken(logoutRequestHeader);
			}).doesNotThrowAnyException();

		}

	}

}