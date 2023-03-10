package com.chicochico.domain.feed.service;


import com.chicochico.domain.feed.dto.PostRequestDto;
import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.feed.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PostService {

	private final PostRepository postRepository;


	/**
	 * 게시글 목록을 조회합니다.
	 *
	 * @param nickname
	 * @param pageable
	 * @return
	 */
	public Page<PostEntity> getPostList(String nickname, Pageable pageable) {
		return Page.empty();
	}


	/**
	 * 게시글 상세 조회합니다.
	 *
	 * @param postId
	 * @return
	 */
	public PostEntity getPost(Long postId) {
		return new PostEntity();
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
