package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.dto.request.PostRequestDto;
import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.feed.repository.PostRepository;
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


@Service
@RequiredArgsConstructor
public class PostService {

	private final PostRepository postRepository;

	private final UserRepository userRepository;

	private final AuthService authService;


	private Page<PostEntity> getUnDeletedPostPage(Page<PostEntity> postPage, Pageable pageable) {
		List<PostEntity> postList = new ArrayList<>(postPage.toList());
		// 삭제된 피드 삭제
		postList.removeIf(post -> post.getIsDeleted().equals(IsDeletedType.Y));
		Page<PostEntity> noDeletedPostPage = new PageImpl<>(postList, pageable, postList.size());
		return noDeletedPostPage;
	}


	/**
	 * 게시글 목록을 조회합니다.
	 *
	 * @param nickname
	 * @param pageable
	 * @return
	 */
	public Page<PostEntity> getPostList(String nickname, Pageable pageable) {
		UserEntity writer = userRepository.findByNickname(nickname).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		if (writer.getIsDeleted().equals(IsDeletedType.Y)) throw new CustomException(ErrorCode.USER_NOT_FOUND); // 이미 탈퇴한 유저
		Page<PostEntity> postPage = postRepository.findByUser(writer, pageable);
		Page<PostEntity> noDeletedPostPage = getUnDeletedPostPage(postPage, pageable);
		return noDeletedPostPage;
	}


	/**
	 * 게시글 상세 조회합니다.
	 *
	 * @param postId
	 * @return
	 */
	public PostEntity getPost(Long postId) {
		PostEntity post = postRepository.findById(postId).orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
		UserEntity writer = post.getUser();
		if (writer.getIsDeleted() == IsDeletedType.Y) throw new CustomException(ErrorCode.USER_NOT_FOUND);
		return post;
	}


	/**
	 * 게시글을 생성합니다.
	 *
	 * @param postRequestDto
	 */
	public void createPost(PostRequestDto postRequestDto) {
		
	}


	/**
	 * 게시글을 수정합니다.
	 *
	 * @param postId
	 * @param postRequestDto
	 */
	public void modifyPost(Long postId, PostRequestDto postRequestDto) {
	}


	/**
	 * 게시글을 삭제합니다.
	 *
	 * @param postId
	 */
	public void deletePost(Long postId) {
	}

}
