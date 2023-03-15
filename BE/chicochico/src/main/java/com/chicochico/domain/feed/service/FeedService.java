package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.repository.FeedRepository;
import com.chicochico.domain.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class FeedService {

	private final FeedRepository feedRepository;



	/**
	 * 추천 피드를 조회합니다.
	 *
	 * @param pageable 페이지네이션
	 * @return 피드 조회 페이지
	 */
	public Page<FeedEntity> getFeedList(Pageable pageable) {

		Page<FeedEntity> feedPage = feedRepository.findAll(pageable);
		return getUnDeletedFeedPage(feedPage, pageable);
	}


	private Page<FeedEntity> getUnDeletedFeedPage(Page<FeedEntity> feedPage, Pageable pageable) {
		List<FeedEntity> feedList = new ArrayList<>(feedPage.toList());
		// 삭제된 피드 삭제
		feedList.removeIf(feed -> feed.getIsDeleted().equals(IsDeletedType.Y));
		Page<FeedEntity> noDeletedFeedPage = new PageImpl<>(feedList, pageable, feedList.size());
		return noDeletedFeedPage;
	}


	/**
	 * 팔로우한 사람의 최신 피드를 조회합니다.
	 *
	 * @param pageable
	 * @return
	 */
	public Page<FeedEntity> getFeedListByFollowUser(List<UserEntity> followingUserList, Pageable pageable) {
		// 팔로우하고 있는 유저들의 피드
		Page<FeedEntity> feedPage = feedRepository.findByUserIn(followingUserList, pageable);
		return getUnDeletedFeedPage(feedPage, pageable);
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
