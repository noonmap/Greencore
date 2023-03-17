package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.entity.FeedTagEntity;
import com.chicochico.domain.feed.entity.LikeEntity;
import com.chicochico.domain.feed.entity.TagEntity;
import com.chicochico.domain.feed.repository.*;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class FeedService {

	private final FeedRepository feedRepository;

	private final FeedTagRepository feedTagRepository;
	private final TagRepository tagRepository;

	private final UserRepository userRepository;
	private final AuthService authService;

	private final LikeRepository likeRepository;

	private final CommentRepository commentRepository;


	/**
	 * 피드 이미 좋아요 했는지 체크
	 *
	 * @param feedId
	 * @return
	 */
	public Boolean isLikedFeed(Long feedId) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		Optional<LikeEntity> like = likeRepository.findByUserAndFeed(user, feed);
		return (like.isEmpty() == false);
	}


	/**
	 * 피드에 있는 댓글 개수 구함
	 *
	 * @param feedId
	 * @return
	 */
	public Integer getCommentCount(Long feedId) {
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		return commentRepository.countByFeed(feed);
	}


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


	private Page<FeedEntity> getUnDeletedFeedPage(List<FeedEntity> _feedList, Pageable pageable) {
		List<FeedEntity> feedList = new ArrayList<>(_feedList); // 입력 list는 unmodifidable list라서 한번 복사를 거쳐줘야한다.
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
		// 태그를 가진 feed찾기
		List<TagEntity> tagList = tagRepository.findByContentContainingIgnoreCase(tag);
		if (tagList.isEmpty()) return Page.empty();
		List<FeedTagEntity> feedTagList = feedTagRepository.findByTag(tagList);
		if (feedTagList.isEmpty()) return Page.empty();
		List<FeedEntity> feedList = feedTagList.stream().map(ft -> ft.getFeed()).collect(Collectors.toList());
		Page<FeedEntity> feedPage = getUnDeletedFeedPage(feedList, pageable);
		return feedPage;
	}


	/**
	 * 피드 좋아요 생성
	 *
	 * @param feedId 좋아요 추가할 피드
	 */
	public void createFeedLike(Long feedId) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		if (likeRepository.findByUserAndFeed(user, feed).isEmpty() == false) {
			throw new CustomException(ErrorCode.FEED_LIKE_DUPLICATE);
		}
		LikeEntity like = LikeEntity.builder().feed(feed).user(user).build();
		likeRepository.save(like);
	}


	/**
	 * 피드 좋아요 취소
	 *
	 * @param feedId 좋아요 취소할 피드
	 */
	public void deleteFeedLike(Long feedId) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		LikeEntity like = likeRepository.findByUserAndFeed(user, feed).orElseThrow(() -> new CustomException(ErrorCode.FEED_LIKE_NOT_FOUND));
		likeRepository.delete(like);
	}

}
