package com.chicochico.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.dto.ResultDto;
import com.chicochico.common.dto.ResultEnum;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.user.dto.RegisterRequestDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.domain.user.service.UserService;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;


public class UserServiceTest {

	private final UserRepository userRepository = Mockito.mock(UserRepository.class);
	private final PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
	private final String testNickname = "test";
	private final String testEmail = "test@naver.com";
	private final String testPassword = "1234";
	//	1	2023-03-14 13:59:49	2023-03-14 13:59:49	test@naver.com	0	0	default_profileImagePath	N	test	$2a$10$gIclEIh2XaBGnbhkTTqCD./2zjhl0nitd6Hi2S3mgnPMaQQrdmP8a	default_profileImagePath
	private final UserEntity user = UserEntity.builder()
		.id(1L)
		.createdAt(LocalDateTime.now())
		.updatedAt(LocalDateTime.now())
		.followerCount(0)
		.followingCount(0)
		.profileImagePath("default_profileImagePath")
		.isDeleted(IsDeletedType.N)
		.nickname(testNickname)
		.password("$2a$10$gIclEIh2XaBGnbhkTTqCD./2zjhl0nitd6Hi2S3mgnPMaQQrdmP8a")
		.introduction("default_introduction")
		.build();

	private UserService userService;

	private AuthService authService;


	@BeforeEach
	public void setUpTest() {
		userService = new UserService(userRepository, passwordEncoder, authService);
	}


	@Test
	@DisplayName("회원가입 - 이미 존재하는 이메일일 경우")
	void createUserTest_존재하는이메일() {
		// given
		Optional<UserEntity> givenUser = Optional.of(user);
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenUser);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
			userService.createUser(new RegisterRequestDto(testEmail, testNickname, testPassword));
		});

		// then
		Assertions.assertEquals(customException.getErrorCode(), ErrorCode.DUPLICATE_RESOURCE);
		//		assertThatThrownBy(() -> userService.createUser(new RegisterRequestDto(testEmail, testNickname, testPassword))).isInstanceOf(CustomException.class);

	}


	@Test
	@DisplayName("회원가입 - 이미 존재하는 닉네임일 경우")
	void createUserTest_존재하는닉네임() {
		// given
		Optional<UserEntity> givenNullUser = Optional.empty();
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenNullUser);

		Optional<UserEntity> givenUser = Optional.of(user);
		Mockito.when(userRepository.findByNickname(testNickname)).thenReturn(givenUser);

		// when
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
			userService.createUser(new RegisterRequestDto(testEmail, testNickname, testPassword));
		});

		// then
		Assertions.assertEquals(customException.getErrorCode(), ErrorCode.DUPLICATE_RESOURCE);
		//		assertThatThrownBy(() -> userService.createUser(new RegisterRequestDto(testEmail, testNickname, testPassword))).isInstanceOf(CustomException.class);

	}


	@Test
	@DisplayName("회원가입 - 성공")
	void createUserTest_회원가입성공() {
		// given
		Optional<UserEntity> givenNullUser = Optional.empty();
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenNullUser);

		Mockito.when(userRepository.findByNickname(testNickname)).thenReturn(givenNullUser);

		// when
		// then
		assertThatCode(() -> {
			userService.createUser(new RegisterRequestDto(testEmail, testNickname, testPassword));
		}).doesNotThrowAnyException();

	}


	@Test
	@DisplayName("닉네임 중복 - 중복")
	void checkNicknameTest_닉네임중복() {
		// given
		Mockito.when(userRepository.findByNickname(testNickname)).thenReturn(Optional.of(user));

		// when
		ResultDto<Boolean> resultDto = userService.checkNickname(testNickname);

		// then
		Assertions.assertEquals(resultDto.getData(), Boolean.FALSE);
		Assertions.assertEquals(resultDto.getResultCode(), ResultEnum.FAIL);
	}


	@Test
	@DisplayName("닉네임 중복 - 중복아님 통과")
	void checkNicknameTest_닉네임중복아님() {
		// given
		Optional<UserEntity> givenNullUser = Optional.empty();
		Mockito.when(userRepository.findByNickname(testNickname)).thenReturn(givenNullUser);

		// when
		ResultDto<Boolean> resultDto = userService.checkNickname(testNickname);

		// then
		Assertions.assertEquals(resultDto.getData(), Boolean.TRUE);
		Assertions.assertEquals(resultDto.getResultCode(), ResultEnum.SUCCESS);

	}


	@Test
	@DisplayName("이메일 중복 - 중복")
	void checkEmailTest_이메일중복() {
		// given
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(user));

		// when
		ResultDto<Boolean> resultDto = userService.checkEmail(testEmail);

		// then
		Assertions.assertEquals(resultDto.getData(), Boolean.FALSE);
		Assertions.assertEquals(resultDto.getResultCode(), ResultEnum.FAIL);

	}


	@Test
	@DisplayName("이메일 중복 - 중복아님 통과")
	void checkEmailTest_이메일중복아님() {
		// given
		Optional<UserEntity> givenNullUser = Optional.empty();
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenNullUser);

		// when
		ResultDto<Boolean> resultDto = userService.checkEmail(testEmail);

		// then
		Assertions.assertEquals(resultDto.getData(), Boolean.TRUE);
		Assertions.assertEquals(resultDto.getResultCode(), ResultEnum.SUCCESS);
	}

}
