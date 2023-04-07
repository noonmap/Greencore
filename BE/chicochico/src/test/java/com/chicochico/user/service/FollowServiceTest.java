package com.chicochico.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.user.entity.FollowEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.FollowRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.domain.user.service.FollowService;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class FollowServiceTest {

	private final Long FOLLOWER_ID = 1L;
	private final Long FOLLOWING_ID = 2L;
	private final String NICKNAME = "testuser";
	private final String FEED_OWNER_NICKNAME = "feedOwner";
	@Mock
	private AuthService authService;
	@Mock
	private UserRepository userRepository;
	@Mock
	private FollowRepository followRepository;
	@InjectMocks
	private FollowService followService;

	@Nested
	@DisplayName("팔로잉 생성")
	class 팔로잉생성 {

		@Test
		@DisplayName("로그인한 유저가 존재하지 않는 경우")
		public void createFollowingTest_WhenUserNotFound_ThrowsCustomException() {
			// given
			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(new UserEntity()));

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.createFollowing(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);

		}


		@Test
		@DisplayName("팔로우를 신청받은 유저가 존재하지 않는 경우 (탈퇴 포함)")
		public void createFollowingTest_WhenFollowerNotFound_ThrowsCustomException2() {
			// given
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).build();

			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(follower));
			when(userRepository.findByNicknameAndIsDeleted(any(), any())).thenReturn(Optional.empty());

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.createFollowing(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("이미 팔로우 하고 있는 경우 (팔로잉 상태)")
		public void createFollowingTest_이미팔로우하고있는경우_ThrowsCustomException() {
			// given
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).build();
			UserEntity following = UserEntity.builder().id(FOLLOWING_ID).nickname(NICKNAME).build();

			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(follower));
			when(userRepository.findByNicknameAndIsDeleted(NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(following));
			when(followRepository.existsByFollowerIdAndFollowingId(FOLLOWER_ID, FOLLOWING_ID)).thenReturn(true);

			// then
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.createFollowing(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.DUPLICATE_RESOURCE);

		}


		@Test
		@DisplayName("팔로우 성공 (팔로잉 생성 성공)")
		public void createFollowingTest_성공() {
			// given
			UserEntity following = UserEntity.builder().id(FOLLOWING_ID).followingCount(0).followerCount(0).build();
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).followingCount(0).followerCount(0).build();

			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(follower));
			when(userRepository.findByNicknameAndIsDeleted(NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(following));
			when(followRepository.existsByFollowerIdAndFollowingId(follower.getId(), following.getId())).thenReturn(false);

			FollowEntity follow = FollowEntity.builder().follower(follower).following(following).build();

			// when
			assertThatCode(() -> {
				followService.createFollowing(NICKNAME);
			}).doesNotThrowAnyException();

			// then
			Mockito.verify(followRepository, times(1)).save(refEq(follow));
		}

	}

	@Nested
	@DisplayName("팔로잉 목록 조회")
	class 팔로잉목록조회 {

		@Test
		@DisplayName("피드 주인이 존재하지 않는 경우")
		public void getFollowingListTest_피드주인없음_ThrowsCustomException() {
			// given
			String nickname = "nonexistent_user";
			when(userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N)).thenReturn(Optional.empty()); // 피드 주인)
			Pageable pageable = PageRequest.of(0, 10);

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.getFollowingList(nickname, pageable);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("성공 - 피드 주인의 following List가 비어있는 경우")
		public void getFollowingListTest_성공_followingList비어있음() {
			// given
			UserEntity user = UserEntity.builder().id(FOLLOWER_ID).nickname(FEED_OWNER_NICKNAME).build();
			when(userRepository.findByNicknameAndIsDeleted(FEED_OWNER_NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(user)); // 피드 주인

			Page<FollowEntity> followList = Page.empty();
			Pageable pageable = PageRequest.of(0, 10);
			when(followRepository.findByFollower(user, pageable)).thenReturn(followList);

			// when
			Page<UserEntity> followingPage = followService.getFollowingList(FEED_OWNER_NICKNAME, pageable);

			// then
			assertThat(followingPage).isEmpty();
		}


		@Test
		@DisplayName("성공 - 피드 주인의 following List가 비어있지 않은 경우")
		public void getFollowingListTest_성공_followingList비어있지않음() {
			// given
			UserEntity user = UserEntity.builder().id(FOLLOWER_ID).nickname(FEED_OWNER_NICKNAME).build();
			UserEntity following1 = UserEntity.builder().id(2L).nickname("following1").build();
			UserEntity following2 = UserEntity.builder().id(3L).nickname("following2").build();
			Pageable pageable = PageRequest.of(0, 10);
			Page<FollowEntity> followPage = new PageImpl<>(Arrays.asList(
				FollowEntity.builder().follower(user).following(following1).build(),
				FollowEntity.builder().follower(user).following(following2).build()
			), pageable, 2);
			// PageImpl 생성자의 (리스트, pageable 객체, 전체 데이터의 크기)

			when(userRepository.findByNicknameAndIsDeleted(FEED_OWNER_NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(user)); // 피드 주인
			when(followRepository.findByFollower(user, pageable)).thenReturn(followPage);

			// when
			Page<UserEntity> followingPage = followService.getFollowingList(user.getNickname(), pageable);

			// then
			assertThat(followingPage).containsExactlyInAnyOrder(following1, following2);
		}

	}

	@Nested
	@DisplayName("팔로워 목록 조회")
	class 팔로워목록조회 {

		@Test
		@DisplayName("피드 주인이 존재하지 않는 경우")
		public void getFollowerListTest_피드주인없음_ThrowsCustomException() {
			// given
			String nickname = "nonexistent_user";
			when(userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N)).thenReturn(Optional.empty()); // 피드 주인)
			Pageable pageable = PageRequest.of(0, 10);

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.getFollowerList(nickname, pageable);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("피드 주인의 follower List가 비어있는 경우")
		public void getFollowerListTest_성공_followerList비어있음() {
			// given
			UserEntity user = UserEntity.builder().id(FOLLOWING_ID).nickname(FEED_OWNER_NICKNAME).build();
			when(userRepository.findByNicknameAndIsDeleted(FEED_OWNER_NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(user)); // 피드 주인

			Pageable pageable = PageRequest.of(0, 10);
			when(followRepository.findByFollowing(user, pageable)).thenReturn(Page.empty());

			// when
			Page<UserEntity> followingPage = followService.getFollowerList(FEED_OWNER_NICKNAME, pageable);

			// then
			assertThat(followingPage).isEmpty();
		}


		@Test
		@DisplayName("성공 - 피드 주인의 follower List가 비어있지 않은 경우")
		public void getFollowerListTest_성공_followerList비어있지않음() {
			// given
			UserEntity user = UserEntity.builder().id(FOLLOWING_ID).nickname(FEED_OWNER_NICKNAME).build();
			UserEntity follower1 = UserEntity.builder().id(3L).nickname("follower1").build();
			UserEntity follower2 = UserEntity.builder().id(4L).nickname("follower2").build();

			Pageable pageable = PageRequest.of(0, 10);
			Page<FollowEntity> followPage = new PageImpl<>(Arrays.asList(
				FollowEntity.builder().follower(follower1).following(user).build(),
				FollowEntity.builder().follower(follower2).following(user).build()
			), pageable, 2);
			// PageImpl 생성자의 (리스트, pageable 객체, 전체 데이터의 크기)
			when(userRepository.findByNicknameAndIsDeleted(FEED_OWNER_NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(user)); // 피드 주인
			when(followRepository.findByFollowing(user, pageable)).thenReturn(followPage);

			// when
			Page<UserEntity> followerPage = followService.getFollowerList(user.getNickname(), pageable);

			// then
			assertThat(followerPage).containsExactlyInAnyOrder(follower1, follower2);
		}

	}

	@Nested
	@DisplayName("팔로잉 삭제")
	class 팔로잉삭제 {

		@Test
		@DisplayName("로그인한 유저가 존재하지 않는 경우")
		public void deleteFollowingTest_WhenUserNotFound_ThrowsCustomException() {
			// given
			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(new UserEntity()));

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.deleteFollowing(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("내가 팔로잉한 유저가 존재하지 않는 경우 (탈퇴 포함)")
		public void deleteFollowingTest_WhenFollowerNotFound_ThrowsCustomException2() {
			// given
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).build();

			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(follower));
			when(userRepository.findByNicknameAndIsDeleted(any(), any())).thenReturn(Optional.empty());

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.deleteFollowing(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("이미 팔로우 안하고 있는 경우")
		public void deleteFollowingTest_이미팔로우안하고있는경우_ThrowsCustomException() {
			// given
			UserEntity following = UserEntity.builder().id(FOLLOWING_ID).build();
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).nickname(NICKNAME).build();

			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(follower));
			when(userRepository.findByNicknameAndIsDeleted(NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(following));
			when(followRepository.findByFollowerAndFollowing(follower, following)).thenReturn(Optional.empty());

			// then
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.deleteFollowing(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.ENTITY_NOT_FOUND);

		}


		@Test
		@DisplayName("팔로우 삭제 성공")
		public void deleteFollowingTest_성공() {
			// given
			UserEntity following = UserEntity.builder().id(FOLLOWING_ID).followingCount(0).followerCount(0).build();
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).followingCount(0).followerCount(0).build();
			FollowEntity follow = FollowEntity.builder().follower(follower).following(following).build();
			when(authService.getUserId()).thenReturn(FOLLOWER_ID);
			when(userRepository.findById(FOLLOWER_ID)).thenReturn(Optional.of(follower));
			when(userRepository.findByNicknameAndIsDeleted(NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(following));
			when(followRepository.findByFollowerAndFollowing(follower, following)).thenReturn(Optional.of(follow));

			// when
			assertThatCode(() -> {
				followService.deleteFollowing(NICKNAME);
			}).doesNotThrowAnyException();

			// then
			Mockito.verify(followRepository, times(1)).delete(follow);
		}

	}

	@Nested
	@DisplayName("팔로워 삭제")
	class 팔로워삭제 {

		@Test
		@DisplayName("로그인한 유저가 존재하지 않는 경우")
		public void deleteFollowerTest_WhenUserNotFound_ThrowsCustomException() {
			// given
			when(authService.getUserId()).thenReturn(FOLLOWING_ID);
			when(userRepository.findById(FOLLOWING_ID)).thenReturn(Optional.of(new UserEntity()));

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.deleteFollower(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("내를 팔로잉한 유저가 존재하지 않는 경우 (탈퇴 포함)")
		public void deleteFollowerTest_WhenFollowerNotFound_ThrowsCustomException2() {
			// given
			UserEntity following = UserEntity.builder().id(FOLLOWING_ID).build();

			when(authService.getUserId()).thenReturn(FOLLOWING_ID);
			when(userRepository.findById(FOLLOWING_ID)).thenReturn(Optional.of(following));
			when(userRepository.findByNicknameAndIsDeleted(any(), any())).thenReturn(Optional.empty());

			// when
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.deleteFollower(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("이미 팔로우 안하고 있는 경우")
		public void deleteFollowerTest_이미팔로우안하고있는경우_ThrowsCustomException() {
			// given
			UserEntity following = UserEntity.builder().id(FOLLOWING_ID).nickname(NICKNAME).build();
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).build();

			when(authService.getUserId()).thenReturn(FOLLOWING_ID);
			when(userRepository.findById(FOLLOWING_ID)).thenReturn(Optional.of(following));
			when(userRepository.findByNicknameAndIsDeleted(NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(follower));
			when(followRepository.findByFollowerAndFollowing(follower, following)).thenReturn(Optional.empty());

			// then
			CustomException customException = Assertions.assertThrows(CustomException.class, () -> {
				followService.deleteFollower(NICKNAME);
			});

			// then
			Assertions.assertEquals(customException.getErrorCode(), ErrorCode.ENTITY_NOT_FOUND);

		}


		@Test
		@DisplayName("팔로우 삭제 성공")
		public void deleteFollowerTest_성공() {
			// given
			UserEntity following = UserEntity.builder().id(FOLLOWING_ID).followingCount(0).followerCount(0).build();
			UserEntity follower = UserEntity.builder().id(FOLLOWER_ID).followingCount(0).followerCount(0).build();
			FollowEntity follow = FollowEntity.builder().follower(follower).following(following).build();
			when(authService.getUserId()).thenReturn(FOLLOWING_ID);
			when(userRepository.findById(FOLLOWING_ID)).thenReturn(Optional.of(following));
			when(userRepository.findByNicknameAndIsDeleted(NICKNAME, IsDeletedType.N)).thenReturn(Optional.of(follower));
			when(followRepository.findByFollowerAndFollowing(follower, following)).thenReturn(Optional.of(follow));

			// when
			assertThatCode(() -> {
				followService.deleteFollower(NICKNAME);
			}).doesNotThrowAnyException();

			// then
			Mockito.verify(followRepository, times(1)).delete(follow);
		}

	}

}
