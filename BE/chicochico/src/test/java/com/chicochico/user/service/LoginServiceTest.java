package com.chicochico.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthTokenProvider;
import com.chicochico.domain.user.dto.request.LoginRequestDto;
import com.chicochico.domain.user.dto.response.ProfileSimpleResponseDto;
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
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

	private final Logger LOGGER = LoggerFactory.getLogger(LoginServiceTest.class);

	private final String testNickname = "test";
	private final String testEmail = "test@naver.com";
	private final String testPassword = "1234";

	private final String testRefreshToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuaWNrbmFtZVwiOlwidGVzdFwiLFwidG9rZW5UeXBlXCI6XCJSRUZSRVNIXCIsXCJ1c2VySWRcIjpcIjFcIn0iLCJpYXQiOjE2Nzg5NTE3ODksImV4cCI6MTY3OTAzODE4OX0.CnUn6AXfK5dX-GSq5YNq800klyK7zhgyKI6g1zqFt2o";

	private final String testBearerToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuaWNrbmFtZVwiOlwidGVzdFwiLFwidG9rZW5UeXBlXCI6XCJBQ0NFU1NcIixcInVzZXJJZFwiOlwiMVwifSIsImlhdCI6MTY3ODg3NTkyOSwiZXhwIjoxNjc4ODc3NzI5fQ.T4R1WRTLR3RhN8T_Vr0nX_WH2rnFly35SYHnETZVTiY";

	private final String REFRESHHEADERKEY = "x-refresh-token";
	private final String ACCESSHEADERKEY = "authorization";
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
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.login(loginRequestDto, httpServletResponse)
		);

		// then
		Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
	}


	@Test
	@DisplayName("로그인 - 유저가 존재 하지 않음 (탈퇴한 유저)")
	void loginTest_로그인실패탈퇴한유저() {
		// given
		Optional<UserEntity> givenUser = Optional.of(UserEntity.builder().isDeleted(IsDeletedType.Y).build());
		LoginRequestDto loginRequestDto = new LoginRequestDto("123", "1234");
		Mockito.when(userRepository.findByEmail(loginRequestDto.getEmail())).thenReturn(givenUser);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.login(loginRequestDto, httpServletResponse)
		);

		// then
		Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
	}


	@Test
	@DisplayName("로그인 실패 - 이메일 존재 비밀번호 불일치 (password not match)")
	void loginTest_로그인실패비밀번호불일치() {
		// given
		Optional<UserEntity> givenUser = Optional.of(UserEntity.builder().email(testEmail)
			.password("$2a$10$RSCiBg7XpDF.64K24OpIFeXh9QJItoKbGMjy73u9v82JyUSbF.pim")
			.nickname(testNickname).isDeleted(IsDeletedType.N).build());
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenUser);
		LOGGER.info("[로그인 - 실패] {}", userRepository.findByEmail(testEmail));

		LoginRequestDto loginRequestDto = new LoginRequestDto(testEmail, testPassword);

		Mockito.when(passwordEncoder.matches(loginRequestDto.getPassword(), givenUser.get().getPassword())).thenReturn(false);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.login(loginRequestDto, httpServletResponse)
		);

		// then
		Assertions.assertEquals(ErrorCode.PASSWORD_NOT_MATCH, customException.getErrorCode());
	}


	@Test
	@DisplayName("로그아웃 - 실패 (엑세스 토큰 없음)")
	void deleteAccessTokenTest_로그아웃실패_ACCESS_TOKEN_NOT_FOUND() {
		// given
		Map<String, String> logoutRequestHeader = new HashMap<>();

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.deleteAccessToken(logoutRequestHeader)
		);

		// then
		Assertions.assertEquals(ErrorCode.ACCESS_TOKEN_NOT_FOUND, customException.getErrorCode());
	}


	@Test
	@DisplayName("로그아웃 - 실패 (엑세스 토큰 유효하지않음)")
	void deleteAccessTokenTest_로그아웃실패_ACCESS_TOKEN_ERROR() {
		// given
		Map<String, String> logoutRequestHeader = new HashMap<>();
		logoutRequestHeader.put(ACCESSHEADERKEY, testBearerToken);

		Mockito.when(authTokenProvider.validate(testBearerToken.substring(7))).thenReturn(false);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.deleteAccessToken(logoutRequestHeader)
		);

		// then
		Assertions.assertEquals(ErrorCode.ACCESS_TOKEN_ERROR, customException.getErrorCode());
	}


	@Test
	@DisplayName("엑세스토큰 재발급 - 실패 (헤더에 refreshToken 없음)")
	void createAccessTokenTest_엑세스토큰재발급실패_REFRESH_TOKEN_NOT_FOUND() {
		// given
		Map<String, String> loginRequestHeader = new HashMap<>();

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.createAccessToken(loginRequestHeader, httpServletResponse)
		);

		// then
		Assertions.assertEquals(ErrorCode.REFRESH_TOKEN_NOT_FOUND, customException.getErrorCode());
	}


	@Test
	@DisplayName("엑세스토큰 재발급 - 실패 (헤더에 accessToken 없음)")
	void createAccessTokenTest_엑세스토큰재발급실패_ACCESS_TOKEN_NOT_FOUND() {
		// given
		Map<String, String> loginRequestHeader = new HashMap<>();

		loginRequestHeader.put(REFRESHHEADERKEY, testRefreshToken);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.createAccessToken(loginRequestHeader, httpServletResponse)
		);

		// then
		Assertions.assertEquals(ErrorCode.ACCESS_TOKEN_NOT_FOUND, customException.getErrorCode());
	}


	@Test
	@DisplayName("엑세스토큰 재발급 - 실패 (Refresh Token 정보가 유효X)")
	void createAccessTokenTest_엑세스토큰재발급실패_REFRESH_TOKEN_ERROR() {
		// given
		Map<String, String> loginRequestHeader = new HashMap<>();

		loginRequestHeader.put(REFRESHHEADERKEY, testRefreshToken);
		loginRequestHeader.put(ACCESSHEADERKEY, testBearerToken);

		Mockito.when(authTokenProvider.validate(testRefreshToken)).thenReturn(false);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> loginService.createAccessToken(loginRequestHeader, httpServletResponse));

		// then
		Assertions.assertEquals(ErrorCode.REFRESH_TOKEN_ERROR, customException.getErrorCode());
	}


	@Test
	@DisplayName("엑세스토큰 재발급 - 실패 (Redis에 Refresh Token정보와 불일치)")
	void createAccessTokenTest_엑세스토큰재발급실패_REFRESH_TOKEN_ERROR_Redis불일치() {
		// given
		Map<String, String> loginRequestHeader = new HashMap<>();

		loginRequestHeader.put(REFRESHHEADERKEY, testRefreshToken);
		loginRequestHeader.put(ACCESSHEADERKEY, testBearerToken);

		Long userId = 123L;

		Mockito.when(authTokenProvider.validate(testRefreshToken)).thenReturn(true);
		Mockito.when(authTokenProvider.getUserId(testBearerToken.substring(7))).thenReturn(userId);
		Mockito.when(authTokenProvider.getUserNickname(testBearerToken.substring(7))).thenReturn("userNickname");

		Mockito.when(redisTemplate.opsForValue()).thenReturn(valueOperations);
		Mockito.when(valueOperations.get("RT:" + userId)).thenReturn("");

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () ->
			loginService.createAccessToken(loginRequestHeader, httpServletResponse)
		);

		// then
		Assertions.assertEquals(ErrorCode.REFRESH_TOKEN_ERROR, customException.getErrorCode());
	}


	// TODO
	@Test
	@DisplayName("엑세스토큰 재발급 - 성공")
	void createAccessTokenTest_엑세스토큰재발급성공() {
		// given
		Map<String, String> loginRequestHeader = new HashMap<>();

		loginRequestHeader.put(REFRESHHEADERKEY, testRefreshToken);
		loginRequestHeader.put(ACCESSHEADERKEY, testBearerToken);

		Long userId = 123L;

		Mockito.when(authTokenProvider.validate(testRefreshToken)).thenReturn(true);
		Mockito.when(authTokenProvider.getUserId(testBearerToken.substring(7))).thenReturn(userId);
		Mockito.when(authTokenProvider.getUserNickname(testBearerToken.substring(7))).thenReturn(testNickname);

		Mockito.when(redisTemplate.opsForValue()).thenReturn(valueOperations);
		Mockito.when(valueOperations.get("RT:" + userId)).thenReturn(testRefreshToken);

		Mockito.when(authTokenProvider.createAccessToken(userId, testNickname)).thenReturn("newAccessToken");
		Mockito.when(authTokenProvider.createRefreshToken(userId, testNickname)).thenReturn("newRefreshToken");
		Mockito.when(authTokenProvider.getExpiration(testRefreshToken)).thenReturn(1000L);

		// when
		assertThatCode(() ->
			loginService.createAccessToken(loginRequestHeader, httpServletResponse)
		).doesNotThrowAnyException();

		// then
		verify(valueOperations, times(1)).set("RT:" + userId, "newRefreshToken", 1000L, TimeUnit.MILLISECONDS);

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
				.isDeleted(IsDeletedType.N)
				.build();
			Optional<UserEntity> givenUser = Optional.of(user);

			LoginRequestDto loginRequestDto = new LoginRequestDto(email, password);

			// mock UserRepository
			when(userRepository.findByEmail(email)).thenReturn(givenUser);

			// mock PasswordEncoder
			Mockito.when(passwordEncoder.matches(loginRequestDto.getPassword(), givenUser.get().getPassword())).thenReturn(true);

			String accessToken = testBearerToken.substring(7);
			// mock AuthTokenProvider
			Mockito.when(authTokenProvider.createAccessToken(user.getId(), user.getNickname())).thenReturn(accessToken);
			Mockito.when(authTokenProvider.createRefreshToken(user.getId(), user.getNickname())).thenReturn(testRefreshToken);
			Mockito.when(authTokenProvider.getExpiration(testRefreshToken)).thenReturn(1000L);

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
			verify(authTokenProvider).setHeaderRefreshToken(httpServletResponse, testRefreshToken);

			verify(valueOperations, times(1)).set("RT:" + user.getId(), testRefreshToken, 1000L, TimeUnit.MILLISECONDS);

		}


		@Test
		@DisplayName("로그아웃 - 성공")
		void deleteAccessTokenTest_로그아웃성공() {
			// given
			String accessToken = "valid_access_token";
			Long userId = 123L;
			Map<String, String> logoutRequestHeader = new HashMap<>();
			logoutRequestHeader.put(ACCESSHEADERKEY, "Bearer " + accessToken);
			when(authTokenProvider.validate(accessToken)).thenReturn(true);
			when(authTokenProvider.getUserId(accessToken)).thenReturn(userId);
			when(redisTemplate.opsForValue().get("RT:" + userId)).thenReturn("valid_refresh_token");

			// when // then
			assertThatCode(() ->
				loginService.deleteAccessToken(logoutRequestHeader)
			).doesNotThrowAnyException();

		}

	}

}