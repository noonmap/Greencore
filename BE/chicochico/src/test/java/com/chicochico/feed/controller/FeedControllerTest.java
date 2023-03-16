package com.chicochico.feed.controller;


import com.chicochico.common.code.FeedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.controller.FeedController;
import com.chicochico.domain.feed.dto.response.FeedResponseDto;
import com.chicochico.domain.feed.service.FeedService;
import com.chicochico.domain.user.dto.response.ProfileResponseDto;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.domain.user.service.FollowService;
import com.chicochico.feed.FeedTestHelper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;


@ExtendWith(MockitoExtension.class)
public class FeedControllerTest extends FeedTestHelper {

	@Mock
	private FeedService feedService;
	@Mock
	private AuthService authService;
	@Mock
	private FollowService followService;
	@Mock
	private UserRepository userRepository;
	@InjectMocks
	private FeedController feedController;


	FeedResponseDto doFeedResponseDto() {
		return FeedResponseDto.builder()
			.user(new ProfileResponseDto())
			.feedCode(FeedType.FEED_POST)
			.observationDate(LocalDate.now())
			.feedId(0L)
			.content("content")
			.imagePath("/image/default.png")
			.likeCount(0)
			.isLiked(true)
			.commentCount(0)
			.createdAt(LocalDateTime.now())
			.build();
	}


	@Nested
	@DisplayName("피드 추천 목록 조회 테스트")
	class 추천피드 {

		@Test
		@DisplayName("피드 추천 목록 조회 성공")
		public void 성공() {
			//			Page<FeedResponseDto> responseDtoPage = new PageImpl<>(List.of(doFeedResponseDto()), 1;
		}


		@Test
		@DisplayName("page 변수가 전달되지 않음")
		public void page실패() {

		}


		@Test
		@DisplayName("size 변수가 전달되지 않음")
		public void size실패() {

		}

	}

	@Nested
	@DisplayName("팔로우한 사람 피드 목록 조회 테스트")
	class 팔로우피드 {

	}

	@Nested
	@DisplayName("태그로 검색한 피드 목록 조회 테스트")
	class 태그피드 {

	}

	@Nested
	@DisplayName("피드 좋아요 테스트")
	class 피드좋아요 {

	}

	@Nested
	@DisplayName("피드 좋아요 취소 테스트")
	class 피드좋아요취소 {

	}

}
