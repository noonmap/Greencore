package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.repository.FeedRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class FeedService {

	private final FeedRepository feedRepository;

	private final UserRepository userRepository;

	private final AuthService authService;


	/**
	 * 추천 피드를 조회합니다.
	 *
	 * @param pageable 페이지네이션
	 * @return 피드 조회 페이지
	 */
	public Page<FeedEntity> getFeedList(Pageable pageable) {

		Page<FeedEntity> page = feedRepository.findAll(pageable);
		return page;
	}


	private List<UserEntity> getFollowingList(Long userId) {
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		List<UserEntity> followingUser = user.getFollowingList().stream()
			.map(fe -> userRepository.findById(
				fe.getFollowing().getId()).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND)))
			.collect(Collectors.toList());
		// deleted된(탈퇴한) 유저를 삭제함
		followingUser.removeIf(e -> e.getIsDeleted().equals(IsDeletedType.Y));
		return followingUser;
	}


	/**
	 * 팔로우한 사람의 최신 피드를 조회합니다.
	 *
	 * @param pageable
	 * @return
	 */
	public Page<FeedEntity> getFeedListByFollowUser(Pageable pageable) {
		Long userId = authService.getUserId();
		// 팔로우하고 있는 유저들
		List<UserEntity> followingUserList = getFollowingList(userId);
		// 팔로우하고 있는 유저들의 Id
		Long[] followingUserIds = (Long[]) followingUserList.stream().map(u -> u.getId()).toArray();
		// 팔로우하고 있는 유저들의 피드
		Page<FeedEntity> feedList = feedRepository.findByUserIn(followingUserIds, pageable);

		return feedList;
	}


	/**
	 * 태그로 피드를 검색한 결과를 조회합니다.
	 *
	 * @param tag      검색할 태그
	 * @param pageable 페이지네이션
	 * @return 피드 조회 페이지
	 */
	public Page<FeedEntity> getFeedListByTag(String tag, Pageable pageable) {

		return Page.empty();
	}


	/**
	 * 피드 좋아요 생성
	 *
	 * @param feedId 좋아요 추가할 피드
	 */
	public void createFeedLike(Long feedId) {
	}


	/**
	 * 피드 좋아요 취소
	 *
	 * @param feedId 좋아요 취소할 피드
	 */
	public void deleteFeedLike(Long feedId) {
	}

}
