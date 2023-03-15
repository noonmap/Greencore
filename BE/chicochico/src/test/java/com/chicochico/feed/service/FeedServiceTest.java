package com.chicochico.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.feed.repository.FeedRepository;
import com.chicochico.domain.feed.service.FeedService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class FeedServiceTest extends FeedServiceTestHelper {

	@Mock
	private FeedRepository feedRepository;

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

			// given
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


		@Test

		}

	}

}
