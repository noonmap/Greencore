package com.chicochico.feed.controller;


import com.chicochico.common.code.FeedType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.dto.ResultDto;
import com.chicochico.common.dto.ResultEnum;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.controller.FeedController;
import com.chicochico.domain.feed.dto.response.FeedResponseDto;
import com.chicochico.domain.feed.service.FeedService;
import com.chicochico.domain.user.dto.response.ProfileResponseDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.domain.user.service.FollowService;
import com.chicochico.feed.FeedTestHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


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

	private MockMvc mockMvc;


	@BeforeEach
	public void init() {
		mockMvc = MockMvcBuilders.standaloneSetup(feedController)
			.setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
			.build();
	}


	protected FeedResponseDto doFeedResponseDto() {
		UserEntity user = UserEntity.builder()
			.id(1L)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.followerCount(0)
			.followingCount(0)
			.profileImagePath("default_profileImagePath")
			.isDeleted(IsDeletedType.N)
			.nickname("nickname")
			.password("encoded_password")
			.introduction("default_introduction")
			.build();
		return FeedResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(user, followService::isFollowed))
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
		public void 성공() throws Exception {
			// given
			Pageable pageable = PageRequest.of(0, 10);

			// when
			when(feedService.getRecommendedFeedList(pageable)).thenReturn(new PageImpl<>(List.of(doPostEntity(0L, 0L)), pageable, 1));
			when(feedService.isLikedFeed(any(Long.class))).thenReturn(true);
			when(feedService.getCommentCount(any(Long.class))).thenReturn(0);

			ResultActions resultActions = mockMvc.perform(
				MockMvcRequestBuilders.get("/feed")
					.queryParam("page", "0")
					.queryParam("size", "10")
			);

			// then
			MvcResult mvcResult = resultActions.andExpect(status().isOk()).andReturn();
			ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
			ResultDto<List<FeedResponseDto>> result = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), ResultDto.class);

			// 데이터 결과 검사
			assertThat(result.getResult()).isEqualTo(ResultEnum.SUCCESS);

		}

	}

	@Nested
	@DisplayName("팔로우한 사람 피드 목록 조회 테스트")
	class 팔로우피드 {

		@Test
		@DisplayName("팔로우한 사람 피드 목록 조회 성공")
		public void test() throws Exception {

			// given
			Pageable pageable = PageRequest.of(0, 10);
			when(feedService.getFeedListByFollowUser(any(List.class), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(doPostEntity(0L, 0L)), pageable, 1));
			when(authService.getUserNickname()).thenReturn("test");
			List<UserEntity> profileList = List.of(new UserEntity());
			Page<UserEntity> page = new PageImpl<>(profileList, pageable, profileList.size());
			when(followService.getFollowingList(any(String.class), any(Pageable.class))).thenReturn(page);

			// when
			ResultActions resultActions = mockMvc.perform(
				MockMvcRequestBuilders.get("/feed/follow")
					.queryParam("page", "0")
					.queryParam("size", "10")
			);

			// then
			MvcResult mvcResult = resultActions.andExpect(status().isOk()).andReturn();
			ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
			ResultDto<List<FeedResponseDto>> result = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), ResultDto.class);

			// 데이터 결과 검사
			assertThat(result.getResult()).isEqualTo(ResultEnum.SUCCESS);
		}

	}

	@Nested
	@DisplayName("태그로 검색한 피드 목록 조회 테스트")
	class 태그피드 {

		@Test
		@DisplayName("태그로 검색한 피드 목록 조회 성공")
		public void test() throws Exception {

			// given
			Pageable pageable = PageRequest.of(0, 10);
			when(feedService.getFeedListByTag(any(String.class), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(doPostEntity(0L, 0L)), pageable, 1));

			// when
			ResultActions resultActions = mockMvc.perform(
				MockMvcRequestBuilders.get("/feed/tag")
					.queryParam("search", "search_tag")
					.queryParam("page", "0")
					.queryParam("size", "10")
			);

			// then
			MvcResult mvcResult = resultActions.andExpect(status().isOk()).andReturn();
			ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
			ResultDto<List<FeedResponseDto>> result = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), ResultDto.class);

			// 데이터 결과 검사
			assertThat(result.getResult()).isEqualTo(ResultEnum.SUCCESS);
		}

	}

	@Nested
	@DisplayName("피드 좋아요 테스트")
	class 피드좋아요 {

		@Test
		@DisplayName("피드 좋아요 성공")
		public void test() throws Exception {

			// when
			ResultActions resultActions = mockMvc.perform(
				MockMvcRequestBuilders.post("/feed/1/like")
			);

			// then
			MvcResult mvcResult = resultActions.andExpect(status().isOk()).andReturn();
			ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
			ResultDto<List<FeedResponseDto>> result = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), ResultDto.class);

			// 데이터 결과 검사
			assertThat(result.getResult()).isEqualTo(ResultEnum.SUCCESS);

		}

	}

	@Nested
	@DisplayName("피드 좋아요 취소 테스트")
	class 피드좋아요취소 {

		@Test
		@DisplayName("피드 좋아요 취소 성공")
		public void test() throws Exception {
			// when
			ResultActions resultActions = mockMvc.perform(
				MockMvcRequestBuilders.delete("/feed/1/like")
			);

			// then
			MvcResult mvcResult = resultActions.andExpect(status().isOk()).andReturn();
			ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
			ResultDto<List<FeedResponseDto>> result = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), ResultDto.class);

			// 데이터 결과 검사
			assertThat(result.getResult()).isEqualTo(ResultEnum.SUCCESS);

		}

	}

}
