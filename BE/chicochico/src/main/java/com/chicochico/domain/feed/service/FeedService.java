package com.chicochico.domain.feed.service;


import com.chicochico.common.code.FeedbackType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.FileService;
import com.chicochico.common.service.RecommenderService;
import com.chicochico.domain.feed.entity.*;
import com.chicochico.domain.feed.repository.*;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Log4j2
@Service
@RequiredArgsConstructor
public class FeedService {

	static public final String IMAGE_FILE_SUB_DIR = "feed";

	private final FeedRepository feedRepository;
	private final FeedTagRepository feedTagRepository;
	private final TagRepository tagRepository;
	private final UserRepository userRepository;
	private final AuthService authService;
	private final LikeRepository likeRepository;
	private final CommentRepository commentRepository;

	private final FileService fileService;
	private final RecommenderService recommenderService;


	/**
	 * tag가 이미 존재하면 기존의 tag를 반환, 존재하지 않으면 생성 후 반환
	 * tag는 소문자로 변환 후 저장함
	 *
	 * @param content
	 * @return
	 */
	@Transactional
	public TagEntity createTag(String content) {
		Optional<TagEntity> tag = tagRepository.findByContentIgnoreCase(content);
		if (tag.isPresent()) return tag.get();
		// 소문자로 변환 후 저장함
		TagEntity newTag = TagEntity.builder().content(content.toLowerCase()).count(0).build();
		return tagRepository.save(newTag);
	}


	/**
	 * FeedTagEntity를 생성하고 feed-tag를 연결.
	 * 이미 FeedTagEntity가 존재하면 새로 생성하지 않음.
	 *
	 * @param tag
	 */
	@Transactional
	public void connectTag(TagEntity tag, FeedEntity feed) {
		// 존재하는지 확인
		Optional<FeedTagEntity> feedTag = feedTagRepository.findByTagAndFeed(tag, feed);
		if (feedTag.isEmpty()) { // 존재하지 않으면 새로 생성
			FeedTagEntity newFeedTag = FeedTagEntity.builder()
				.tag(tag)
				.feed(feed)
				.build();
			feedTagRepository.save(newFeedTag);
			// tag 사용 카운트 증가
			tag.increaseCount();
			tagRepository.save(tag);
		}
	}


	/**
	 * tag 내용 리스트를 받아서, feed와 연결시킴.
	 * tag 리스트 null & empty 체크를 포함함.
	 *
	 * @param tags
	 * @param feed
	 */
	public void createAndConnectTags(List<String> tags, FeedEntity feed) {
		if (tags == null || tags.isEmpty()) return;
		for (String tagContent : tags) {
			TagEntity tag = createTag(tagContent);
			connectTag(tag, feed);
		}
	}


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
	 * 피드에 연결된 태그의 리스트를 조회
	 *
	 * @param feedId
	 * @return
	 */
	public List<TagEntity> getTagList(Long feedId) {
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		List<FeedTagEntity> feedTagList = feed.getFeedTagList();
		List<TagEntity> tagList = feedTagList.stream().map(FeedTagEntity::getTag).collect(Collectors.toList());
		return tagList;
	}


	/**
	 * 피드에 연결된 태그들의 내용 리스트를 조회
	 *
	 * @param feedId
	 * @return
	 */
	public List<String> getTagContentList(Long feedId) {
		List<TagEntity> tagList = getTagList(feedId);
		List<String> tagContentList = tagList.stream().map(TagEntity::getContent).collect(Collectors.toList());
		return tagContentList;
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
	public List<FeedEntity> getRecommendedFeedList(Pageable pageable) {
		// Recommender System에서 추천받은 게시글의 id list
		Long userId = authService.getUserId();
		List<Long> recommendedFeedIds = recommenderService.getRecommendFeedIdList(userId, pageable.getPageNumber(), pageable.getPageSize());
		log.info("[Recommened Feed Ids]" + recommendedFeedIds);
		// id list를 feed로 변환
		List<FeedEntity> feedList = feedRepository.findByIdInAndIsDeleted(recommendedFeedIds, IsDeletedType.N, pageable);
		return feedList;
	}


	/**
	 * feedPage에서 삭제되지 않은(IsDeletedType.N인) 피드 페이지를 얻음
	 *
	 * @param feedPage
	 * @param pageable
	 * @return
	 */
	private Page<FeedEntity> getUnDeletedFeedPage(Page<FeedEntity> feedPage, Pageable pageable) {
		List<FeedEntity> feedList = new ArrayList<>(feedPage.toList());
		// 삭제된 피드 삭제
		feedList.removeIf(feed -> feed.getIsDeleted().equals(IsDeletedType.Y));
		Page<FeedEntity> noDeletedFeedPage = new PageImpl<>(feedList, pageable, feedList.size());
		return noDeletedFeedPage;
	}


	/**
	 * feedList에서 삭제되지 않은(IsDeletedType.N인) 피드 페이지를 얻음
	 *
	 * @param _feedList
	 * @return
	 */
	private List<FeedEntity> getUnDeletedFeedPage(List<FeedEntity> _feedList) {
		List<FeedEntity> feedList = new ArrayList<>(_feedList); // 입력 list는 unmodifidable list라서 한번 복사를 거쳐줘야한다.
		// 삭제된 피드 삭제
		feedList.removeIf(feed -> feed.getIsDeleted().equals(IsDeletedType.Y));
		return feedList;
	}


	/**
	 * feedList에서 삭제되지 않은(IsDeletedType.N인) 피드 페이지를 얻음
	 *
	 * @param _feedList
	 * @param pageable
	 * @return
	 */
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
	 * @return
	 */
	public List<FeedEntity> getFeedListByFollowUser(List<UserEntity> followingUserList) {
		// 팔로우하고 있는 유저들의 피드
		List<FeedEntity> feedList = feedRepository.findByUserIn(followingUserList);
		return getUnDeletedFeedPage(feedList);
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

		// Recommender system에 positive feedback 추가
		recommenderService.insertFeedback(FeedbackType.like, userId, feedId, LocalDateTime.now());
	}


	/**
	 * 피드 좋아요 1개 취소
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


	/**
	 * 피드에 연결된 태그와의 연결점을 모두 삭제
	 *
	 * @param feed
	 */
	public void deleteConnectedTags(FeedEntity feed) {
		// 연결된 Feed-tag 리스트 조회
		List<FeedTagEntity> feedTagList = feedTagRepository.findByFeed(feed);
		if (feedTagList.isEmpty()) return;

		// feed-tag 삭제 & tag의 count가 0이 되면 tag도 삭제
		for (FeedTagEntity feedTag : feedTagList) {
			TagEntity tag = feedTag.getTag();
			feedTagRepository.delete(feedTag);

			tag.decreaseCount();
			if (tag.getCount() <= 0) tagRepository.delete(tag);
			else tagRepository.save(tag);
		}
	}


	/**
	 * 피드에 연결된 모든 댓글을 삭제
	 *
	 * @param feed
	 */
	public void deleteConnectedComment(FeedEntity feed) {
		List<CommentEntity> commentList = commentRepository.findByFeed(feed);
		for (CommentEntity comment : commentList) {
			comment.setIsDeleted();
		}
		commentRepository.saveAll(commentList);
	}


	/**
	 * 피드에 연결된 모든 좋아요를 삭제
	 *
	 * @param feed
	 */
	public void deleteConnectedLike(FeedEntity feed) {
		List<LikeEntity> likeList = likeRepository.findByFeed(feed);
		likeRepository.deleteAll(likeList);
	}


	/**
	 * 피드에 연결된 모든 요소(이미지, 태그, 댓글, 좋아요)를 삭제
	 *
	 * @param feed
	 */
	public void deleteConnectedComponents(FeedEntity feed) {
		// 이미지 삭제 --> 지금은 영구 삭제
		String imagePath = feed.getImagePath();
		fileService.deleteImageFile(imagePath);

		// 연결된 tag 삭제 --> 영구 삭제
		deleteConnectedTags(feed);

		// 연결된 comment 삭제 --> isDeleted
		deleteConnectedComment(feed);

		// 연결된 좋아요 삭제 --> 영구 삭제
		deleteConnectedLike(feed);
	}


	@Transactional
	public void deleteAllLikesByUserId(Long userId) {
		likeRepository.deleteByUserId(userId);
	}

}
