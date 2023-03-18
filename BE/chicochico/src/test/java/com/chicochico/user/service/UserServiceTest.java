package com.chicochico.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.user.dto.request.PasswordRequestDto;
import com.chicochico.domain.user.dto.request.RegisterRequestDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.domain.user.service.UserService;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;
import static org.mockito.Mockito.times;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

	private final String testNickname = "test";
	private final String testEmail = "test@naver.com";
	private final String testPassword = "1234";

	private final String testEncodePassword = "$2a$10$gIclEIh2XaBGnbhkTTqCD./2zjhl0nitd6Hi2S3mgnPMaQQrdmP8a";
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
		.password(testEncodePassword)
		.introduction("default_introduction")
		.build();
	@Mock
	private UserRepository userRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@InjectMocks
	private UserService userService;

	@Mock
	private AuthService authService;


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
		Boolean checkNickname = userService.checkNickname(testNickname);

		// then
		Assertions.assertEquals(checkNickname, Boolean.FALSE);
	}


	@Test
	@DisplayName("닉네임 중복 - 중복아님 통과")
	void checkNicknameTest_닉네임중복아님() {
		// given
		Optional<UserEntity> givenNullUser = Optional.empty();
		Mockito.when(userRepository.findByNickname(testNickname)).thenReturn(givenNullUser);

		// when
		Boolean checkNickname = userService.checkNickname(testNickname);

		// then
		Assertions.assertEquals(checkNickname, Boolean.TRUE);

	}


	@Test
	@DisplayName("이메일 중복 - 중복")
	void checkEmailTest_이메일중복() {
		// given
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(user));

		// when
		Boolean checkEmail = userService.checkEmail(testEmail);

		// then
		Assertions.assertEquals(checkEmail, Boolean.FALSE);

	}


	@Test
	@DisplayName("이메일 중복 - 중복아님 통과")
	void checkEmailTest_이메일중복아님() {
		// given
		Optional<UserEntity> givenNullUser = Optional.empty();
		Mockito.when(userRepository.findByEmail(testEmail)).thenReturn(givenNullUser);

		// when
		Boolean checkEmail = userService.checkEmail(testEmail);

		// then
		Assertions.assertEquals(checkEmail, Boolean.TRUE);
	}


	@Nested
	class AfterLoginTest {

		@BeforeEach
		void setUp() {
			UserDetails user = createUserDetails();

			SecurityContext context = SecurityContextHolder.getContext();
			context.setAuthentication(new UsernamePasswordAuthenticationToken(user, user.getPassword(), user.getAuthorities()));
		}


		@AfterEach
		void afterSetting() {
			SecurityContextHolder.clearContext();
		}


		private UserDetails createUserDetails() {
			return new UserDetails() {
				@Override
				public Collection<? extends GrantedAuthority> getAuthorities() {
					return null;
				}


				@Override
				public String getPassword() {
					return testPassword;
				}


				@Override
				public String getUsername() {
					return "1";
				}


				@Override
				public boolean isAccountNonExpired() {
					return true;
				}


				@Override
				public boolean isAccountNonLocked() {
					return true;
				}


				@Override
				public boolean isCredentialsNonExpired() {
					return true;
				}


				@Override
				public boolean isEnabled() {
					return true;
				}
			};
		}


		@Test
		@DisplayName("비밀번호확인 - 실패:사용자없음")
		void checkPasswordTest_비밀번호확인실패_사용자없음() {
			// given
			Long userId = 1L;
			Mockito.when(authService.getUserId()).thenReturn(userId);
			Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

			PasswordRequestDto passwordRequestDto = new PasswordRequestDto(testPassword);

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				userService.checkPassword(passwordRequestDto);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("비밀번호확인 - 불일치")
		void checkPasswordTest_비밀번호확인불일치() {
			// given
			Long userId = 1L;
			Mockito.when(authService.getUserId()).thenReturn(userId);
			Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));

			PasswordRequestDto passwordRequestDto = new PasswordRequestDto(testPassword);
			Mockito.when(passwordEncoder.matches(passwordRequestDto.getPassword(), user.getPassword())).thenReturn(false);

			// when
			Boolean checkPassword = userService.checkPassword(passwordRequestDto);

			// then
			Assertions.assertEquals(checkPassword, Boolean.FALSE);
		}


		@Test
		@DisplayName("비밀번호확인 - 성공")
		void checkPasswordTest_비밀번호확인성공() {
			// given
			Long userId = 1L;
			Mockito.when(authService.getUserId()).thenReturn(userId);
			Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));

			PasswordRequestDto passwordRequestDto = new PasswordRequestDto(testPassword);
			Mockito.when(passwordEncoder.matches(passwordRequestDto.getPassword(), user.getPassword())).thenReturn(true);

			// when
			Boolean checkPassword = userService.checkPassword(passwordRequestDto);

			// then
			Assertions.assertEquals(checkPassword, Boolean.TRUE);
		}


		@Test
		@DisplayName("비밀번호수정 - 실패 (변경 전 후 비번 동일)")
		void modifyPasswordTest_비밀번호수정실패_비번동일() {
			// given
			Long userId = user.getId();
			Mockito.when(authService.getUserId()).thenReturn(userId);
			Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));

			PasswordRequestDto passwordRequestDto = new PasswordRequestDto(testPassword);
			Mockito.when(passwordEncoder.matches(passwordRequestDto.getPassword(), user.getPassword())).thenReturn(true);

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				userService.modifyPassword(passwordRequestDto);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.DUPLICATE_RESOURCE);
		}


		@Test
		@DisplayName("비밀번호수정 - 실패 (사용자 없음)")
		void modifyPasswordTest_비밀번호수정실패_사용자없음() {
			// given
			Long userId = 1L;
			Mockito.when(authService.getUserId()).thenReturn(userId);
			Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

			PasswordRequestDto passwordRequestDto = new PasswordRequestDto("12345");

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				userService.modifyPassword(passwordRequestDto);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("비밀번호수정 - 성공")
		void modifyPasswordTest_비밀번호수정성공() {
			// given
			Long userId = user.getId();
			Mockito.when(authService.getUserId()).thenReturn(userId);
			Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));

			PasswordRequestDto passwordRequestDto = new PasswordRequestDto("12345");
			Mockito.when(passwordEncoder.matches(passwordRequestDto.getPassword(), user.getPassword())).thenReturn(false);

			Optional<UserEntity> givenNullUser = Optional.of(user);
			Mockito.when(userRepository.findById(1L)).thenReturn(givenNullUser);

			// when
			userService.modifyPassword(passwordRequestDto);

			// then
			Assertions.assertNotEquals(user.getPassword(), testEncodePassword);

			Mockito.verify(userRepository, times(1)).findById(1L);
			Assertions.assertNotEquals(user.getPassword(), testEncodePassword);
			Mockito.verify(userRepository, times(1)).save(user);
		}


		@Test
		@DisplayName("회원탈퇴 - 실패")
		public void deleteUserTest_회원탈퇴실패UserNotFound() {
			// given
			Mockito.when(authService.getUserId()).thenReturn(1L);
			Mockito.when(userRepository.findById(1L)).thenReturn(Optional.empty());

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				userService.deleteUser();
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("회원탈퇴 - 성공")
		void deleteUserTest_회원탈퇴성공() {
			// given
			// mock AuthService
			Long userId = 1L;
			Mockito.when(authService.getUserId()).thenReturn(userId);

			// mock UserRepository
			Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));
			Mockito.when(userRepository.save(user)).thenReturn(user);

			// when
			userService.deleteUser();

			// then
			Assertions.assertEquals(user.getIsDeleted(), IsDeletedType.Y);
			Mockito.verify(userRepository, times(1)).save(user);

		}

	}

}
