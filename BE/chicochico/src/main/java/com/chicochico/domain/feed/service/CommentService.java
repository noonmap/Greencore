package com.chicochico.domain.feed.service;


import com.chicochico.domain.feed.dto.CommentRequestDto;
import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.feed.repository.CommentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class CommentService {

	private CommentRepository commentRepository;


	/**
	 * 해당 피드의 댓글 목록을 조회합니다.
	 *
	 * @param feedId
	 * @param pageable
	 * @return
	 */
	public Page<CommentEntity> getCommentList(Long feedId, Pageable pageable) {
		return null;
	}


	/**
	 * 해당 피드의 댓글을 생성합니다.
	 *
	 * @param feedId
	 * @param commentRequestDto
	 */
	public void createComment(Long feedId, CommentRequestDto commentRequestDto) {

	}


	/**
	 * 해당 피드 댓글을 수정합니다.
	 *
	 * @param commentId
	 * @param commentRequestDto
	 */
	public void modifyComment(Long commentId, CommentRequestDto commentRequestDto) {

	}


	/**
	 * 해당 피드 댓글을 삭제합니다.
	 *
	 * @param commentId
	 */
	public void deleteComment(Long commentId) {

	}

}
