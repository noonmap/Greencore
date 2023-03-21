package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.dto.request.CommentRequestDto;
import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.repository.CommentRepository;
import com.chicochico.domain.feed.repository.FeedRepository;
import com.chicochico.domain.user.entity.FollowEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.FollowRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	private final FeedRepository feedRepository;
	private final UserRepository userRepository;
	private final FollowRepository followRepository;

	private AuthService authService;

	private FollowEntity mentionUser;


	/**
	 * 해당 피드의 댓글 목록을 조회합니다.
	 *
	 * @param feedId
	 * @param pageable
	 * @return
	 */
	public Page<CommentEntity> getCommentList(Long feedId, Pageable pageable) {
		// 피드 찾기
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		// comment page 형식으로 가지고 오기
		Page<CommentEntity> commentEntityPage = commentRepository.findByFeedAndIsDeleted(feed, pageable, IsDeletedType.N);
		return commentEntityPage;
	}


	/**
	 * 내가 팔로우 한 사람 중 멘션할 유저 리스트 조회합니다.
	 *
	 * @param nickname
	 * @return
	 */
	public List<UserEntity> getMentionUserList(String nickname) {
		//현재 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//사용자가 팔로우하는 유저 중 해당 글자로 시작하는 nickname
		List<UserEntity> mentionUserList = followRepository.findAllByFollowerAndFollowingNicknameStartingWith(user, nickname)
			.stream().map(FollowEntity::getFollowing).collect(Collectors.toList());

		return mentionUserList;
	}


	/**
	 * mention할 유저 선택합니다.
	 *
	 * @param userId
	 * @return
	 */
	public UserEntity getMentionUser(Long userId) {
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		return user;
	}


	/**
	 * 해당 피드의 댓글을 생성합니다.
	 *
	 * @param feedId
	 * @param commentRequestDto
	 */
	public void createComment(Long feedId, CommentRequestDto commentRequestDto) {
		//피드 찾기
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		//현재 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		//멘션 사용자 찾기
		if (commentRequestDto.getMentionNickname() != null && !commentRequestDto.getMentionNickname().equals("")) {
			//mention 할 사람 찾기
			Long mentionId = userRepository.findByNickname(commentRequestDto.getMentionNickname()).get().getId();
			//댓글 등록
			commentRepository.save(commentRequestDto.toEntity(feed, user, mentionId));

			//피드에 댓글 수 증가
			Integer commnetCount = feed.getCommentCount();
			feed.setCommentCount(commnetCount + 1);
			feedRepository.save(feed);

		} else {
			//멘션 사용자를 지정하지 않는 경우
			commentRepository.save(commentRequestDto.toEntity(feed, user));
		}
	}


	/**
	 * 해당 피드 댓글을 수정합니다.
	 *
	 * @param commentId
	 * @param commentRequestDto
	 */
	public void modifyComment(Long commentId, CommentRequestDto commentRequestDto) {

		//댓글 찾기
		CommentEntity comment = commentRepository.findById(commentId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//피드 찾기
		FeedEntity feed = feedRepository.findById(comment.getFeed().getId()).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));

		//현재 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		if (user.equals(comment.getUser())) {

			//멘션 사용자 찾기
			if (commentRequestDto.getMentionNickname() != null && !commentRequestDto.getMentionNickname().equals("")) {
				String nickname = commentRequestDto.getMentionNickname();
				Long mentionId = userRepository.findByNickname(nickname).get().getId();
				//댓글 수정
				CommentEntity newComment = commentRequestDto.toEntity(commentId, feed, user, mentionId);
				commentRepository.save(newComment);

			} else {
				//멘션 사용자가 없는 경우
				CommentEntity newComment = commentRequestDto.toEntity(commentId, feed, user);
				commentRepository.save(newComment);

			}
		} else {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

	}


	/**
	 * 해당 피드 댓글을 삭제합니다.
	 *
	 * @param commentId
	 */
	@Transactional
	public void deleteComment(Long commentId) {
		//댓글
		CommentEntity comment = commentRepository.findById(commentId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//피드 찾기
		FeedEntity feed = feedRepository.findById(comment.getFeed().getId()).orElseThrow(() -> new CustomException(ErrorCode.FEED_NOT_FOUND));
		//피드에 댓글 수 감소
		Integer commnetCount = feed.getCommentCount();
		//현재 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		if (user.equals(comment.getUser())) {
			comment.setIsDeleted();
			commentRepository.save(comment);

			feed.setCommentCount(commnetCount - 1);
			feedRepository.save(feed);
		} else {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}
	}

}
