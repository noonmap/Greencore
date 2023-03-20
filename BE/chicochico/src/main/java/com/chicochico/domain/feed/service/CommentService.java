package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.dto.request.CommentRequestDto;
import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.repository.CommentRepository;
import com.chicochico.domain.feed.repository.FeedRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	private final FeedRepository feedRepository;
	private final UserRepository userRepository;

	private AuthService authService;


	/**
	 * 해당 피드의 댓글 목록을 조회합니다.
	 *
	 * @param feedId
	 * @param pageable
	 * @return
	 */
	public Page<CommentEntity> getCommentList(Long feedId, Pageable pageable) {
		// 피드 찾기
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		// comment page 형식으로 가지고 오기
		Page<CommentEntity> commentEntityPage = commentRepository.findByFeedAndIsDeleted(feed, pageable, IsDeletedType.N);
		return commentEntityPage;
	}


	/**
	 * 해당 피드의 댓글을 생성합니다.
	 *
	 * @param feedId
	 * @param commentRequestDto
	 */
	public void createComment(Long feedId, CommentRequestDto commentRequestDto) {
		//피드 찾기
		FeedEntity feed = feedRepository.findById(feedId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//현재 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ACCESS_TOKEN_NOT_FOUND));
		//멘션 사용자 찾기
		if (commentRequestDto.getMentionNickname() != null && !commentRequestDto.getMentionNickname().equals("")) {
			String nickname = commentRequestDto.getMentionNickname();
			Long mentionId = userRepository.findByNickname(nickname).get().getId();
			//댓글 등록
			commentRepository.save(commentRequestDto.toEntity(feed, user, mentionId));
		}
		//멘션 없는 경우 댓글 등록
		//		commentRepository.save(commentRequestDto.toEntity(feed, user));

	}


	/**
	 * 해당 피드 댓글을 수정합니다.
	 *
	 * @param commentId
	 * @param commentRequestDto
	 */
	public void modifyComment(Long commentId, CommentRequestDto commentRequestDto) {
		//피드 찾기
		CommentEntity comment = commentRepository.findById(commentId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//현재 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ACCESS_TOKEN_NOT_FOUND));

		if (user.equals(comment.getUser())) {

			//멘션 사용자 찾기
			if (commentRequestDto.getMentionNickname() != null && !commentRequestDto.getMentionNickname().equals("")) {
				String nickname = commentRequestDto.getMentionNickname();
				Long mentionId = userRepository.findByNickname(nickname).get().getId();
				//댓글 등록
				CommentEntity newComment = CommentEntity.builder()
					.id(commentId)
					.content(comment.getContent())
					.feed(comment.getFeed())
					.mentionUserId(mentionId)
					.isDeleted(IsDeletedType.N)
					.user(user)
					.build();

				commentRepository.save(newComment);
			} else {
				CommentEntity newComment = CommentEntity.builder()
					.id(commentId)
					.content(comment.getContent())
					.feed(comment.getFeed())
					.isDeleted(IsDeletedType.N)
					.user(user)
					.build();

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
		//피드 찾기
		CommentEntity comment = commentRepository.findById(commentId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//현재 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ACCESS_TOKEN_NOT_FOUND));
		if (user.equals(comment.getUser())) {
			comment.setIsDeleted();
		} else {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}
	}

}
