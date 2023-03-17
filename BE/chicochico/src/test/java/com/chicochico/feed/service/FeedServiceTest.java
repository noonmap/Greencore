package com.chicochico.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.entity.*;
import com.chicochico.domain.feed.repository.FeedRepository;
import com.chicochico.domain.feed.repository.FeedTagRepository;
import com.chicochico.domain.feed.repository.LikeRepository;
import com.chicochico.domain.feed.repository.TagRepository;
import com.chicochico.domain.feed.service.FeedService;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import com.chicochico.feed.FeedTestHelper;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class FeedServiceTest extends FeedTestHelper {

	@Mock
	private AuthService authService;
	@Mock
	private LikeRepository likeRepository;
	@Mock
	private TagRepository tagRepository;

	@Mock
	private FeedTagRepository feedTagRepository;

	@Mock
	private FeedRepository feedRepository;

	@Mock
	private UserRepository userRepository;
	@InjectMocks
	private FeedService feedService;

	@Nested
	@DisplayName("추천 피드 조회 테스트")
	class RecommendFeedListTest {

		public Page<FeedEntity> doPage(Pageable pageable) {
			List<FeedEntity> list = new ArrayList<>();
			list.add(doPostEntity(0L, 0L));
			list.add(doPostEntity(0L, 1L));
			list.add(doPostEntity(0L, 2L));
			list.add(doDiaryEntity(0L, 3L));
			list.add(doDiaryEntity(0L, 4L));
			list.add(doDiaryEntity(0L, 5L));
			return new PageImpl<>(list, pageable, list.size());
		}


		@Test
		@DisplayName("삭제된 피드 목록이 조회 안되는지 확인")
		public void 삭제된피드목록조회X() {

			// given
			Pageable pageable = PageRequest.of(0, 10);
			// 삭제된 게시글을 포함한 페이지를 반환
			List<FeedEntity> list = new ArrayList<>();
			list.add(doPostEntity(0L, 0L, IsDeletedType.Y));
			Page<FeedEntity> page = new PageImpl<>(list, pageable, list.size());
			when(feedRepository.findAll(any(Pageable.class))).thenReturn(page);

			// when
			Page<FeedEntity> result = feedService.getFeedList(pageable);

			// given
			Assertions.assertThat(result.isEmpty()).isTrue();
		}


		@Test
		@DisplayName("추천 피드 목록 조회 성공")
		public void 추천피드목록조회성공() {
			// given : page, size가 있는 Pageable이 주어짐
			Pageable pageable = PageRequest.of(0, 10);
			Page<FeedEntity> page = doPage(pageable);

			when(feedRepository.findAll(pageable)).thenReturn(page);

			// when
			Page<FeedEntity> result = feedService.getFeedList(pageable);

			// then
			// list에 속한 entity들이 Post와 Diary로 타입이 제대로 들어갔는지 확인
			Assertions.assertThat(result.toList().get(0) instanceof PostEntity).isTrue();
			Assertions.assertThat(result.toList().get(3) instanceof DiaryEntity).isTrue();
			// Diary가 확장된 필드 값을 들고있는지 확인
			Assertions.assertThat(((DiaryEntity) result.toList().get(3)).getObservationDate()).isNotNull().isInstanceOf(LocalDate.class);
		}

	}

	@Nested
	@DisplayName("팔로우한 사람 피드 조회 테스트")
	class FollowedFeedListTest {

		@Test
		@DisplayName("삭제된 피드 목록이 조회 안되는지 확인")
		public void 삭제된피드목록조회X() {

			// given
			Pageable pageable = PageRequest.of(0, 10);
			// 삭제된 게시글을 포함한 페이지를 반환
			List<FeedEntity> list = new ArrayList<>();
			list.add(doPostEntity(0L, 0L, IsDeletedType.Y));
			Page<FeedEntity> page = new PageImpl<>(list, pageable, list.size());
			when(feedRepository.findByUserIn(any(List.class), any(Pageable.class))).thenReturn(page);

			// when
			Page<FeedEntity> result = feedService.getFeedListByFollowUser(new ArrayList<>(), pageable);

			// then
			Assertions.assertThat(result.isEmpty()).isTrue();

		}


		@Test
		@DisplayName("[Deprecated] 팔로우한 사람이 탈퇴한 유저인 경우, 피드 조회가 되면 안됨")
		public void 탈퇴한팔로우피드목록조회실패() {
			// 이건 UserService에서 팔로우 리스트를 검증해야 함
		}


		@Test
		@DisplayName("[Deprecated] 팔로우하지 않은 사람의 피드가 포함되지 않았는지 테스트")
		public void 팔로우피드목록조회성공() {
			// 이건 UserService에서 팔로우 리스트를 검증해야 함
		}

	}

	@Nested
	@DisplayName("태그로 검색한 피드 조회 테스트")
	class TagFeedListTest {

		@Test
		@DisplayName("삭제된 피드 목록이 조회 안되는지 확인")
		public void 삭제된피드목록조회X() {
			// given
			Pageable pageable = PageRequest.of(0, 10);
			PostEntity post = doPostEntity(0L, 0L, IsDeletedType.Y);
			TagEntity tag = TagEntity.builder().content("tag").build();
			FeedTagEntity feedTag = FeedTagEntity.builder().tag(tag).feed(post).build();

			when(tagRepository.findByContentContainingIgnoreCase(any(String.class))).thenReturn(List.of(tag));
			when(feedTagRepository.findByTag(any(List.class))).thenReturn(List.of(feedTag));

			// when
			Page<FeedEntity> result = feedService.getFeedListByTag("tag", pageable);

			// then
			Assertions.assertThat(result.isEmpty()).isTrue();
		}


		@Test
		@DisplayName("태그 대소문자 안 가리고 검색되는지 테스트")
		public void 대소문자피드목록조회() {
			// repository에서 검사
		}


		@Test
		@DisplayName("태그 일부 문자 포함 검색되는지 테스트")
		public void 태그문자포함검색피드목록조회() {
			// repository에서 검사
		}


		@Test
		@DisplayName("태그에 포함 안되는 피드가 검색이 안되는지 테스트")
		public void 태그문자미포함검색피드목록조회() {
			// repository에서 검사
		}

	}

	@Nested
	@DisplayName("피드 좋아요 추가 테스트")
	class FeedLikeTest {

		@Test
		@DisplayName("유저가 존재하지 않을 경우 실패")
		public void 유저존재하지않음() {
			// given
			when(authService.getUserId()).thenReturn(10L);

			// when
			CustomException customException = org.junit.jupiter.api.Assertions.assertThrows(CustomException.class, () -> feedService.createFeedLike(1L));

			// then
			Assertions.assertThat(customException.getErrorCode() == ErrorCode.USER_NOT_FOUND);
		}


		@Test
		@DisplayName("피드가 존재하지 않을 경우 실패")
		public void 피드존재하지않음() {
			// given
			when(authService.getUserId()).thenReturn(10L);
			when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));

			// when
			CustomException customException = org.junit.jupiter.api.Assertions.assertThrows(CustomException.class, () -> feedService.createFeedLike(1L));

			// then
			Assertions.assertThat(customException.getErrorCode() == ErrorCode.FEED_NOT_FOUND);
		}


		@Test
		@DisplayName("이미 좋아요를 한 경우 실패")
		public void 이미존재하는좋아요() {
			// given
			when(authService.getUserId()).thenReturn(10L);
			when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
			when(feedRepository.findById(any(Long.class))).thenReturn(Optional.of(FeedEntity.builder().build()));
			when(likeRepository.findByUserAndFeed(any(UserEntity.class), any(FeedEntity.class))).thenReturn(Optional.of(LikeEntity.builder().build()));

			// when
			CustomException customException = org.junit.jupiter.api.Assertions.assertThrows(CustomException.class, () -> feedService.createFeedLike(1L));

			// then
			Assertions.assertThat(customException.getErrorCode() == ErrorCode.FEED_LIKE_DUPLICATE);

		}

	}

	@Nested
	@DisplayName("피드 좋아요 취소 테스트")
	class FeedUnLikeTest {

		@Test
		@DisplayName("좋아요가 없는 경우 좋아요 취소 실패")
		public void 존재하지않는좋아요() {
			// given
			when(authService.getUserId()).thenReturn(10L);
			when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
			when(feedRepository.findById(any(Long.class))).thenReturn(Optional.of(FeedEntity.builder().build()));

			// when
			CustomException customException = org.junit.jupiter.api.Assertions.assertThrows(CustomException.class, () -> feedService.deleteFeedLike(1L));

			// then
			Assertions.assertThat(customException.getErrorCode() == ErrorCode.FEED_LIKE_NOT_FOUND);

		}

	}

}
