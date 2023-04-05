package com.chicochico.domain.feed.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.feed.dto.request.PostRequestDto;
import com.chicochico.domain.feed.dto.response.PostResponseDto;
import com.chicochico.domain.feed.dto.response.PostSimpleResponseDto;
import com.chicochico.domain.feed.entity.PostEntity;
import com.chicochico.domain.feed.service.FeedService;
import com.chicochico.domain.feed.service.PostService;
import com.chicochico.domain.user.service.FollowService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
@Api(tags = "게시글 관련 API")
public class PostController {

	private final PostService postService;

	private final FeedService feedService;

	private final FollowService followService;


	@GetMapping(value = "/list/{nickname}")
	@ApiOperation(value = "게시글 목록을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<PostSimpleResponseDto>>> getPostList(@PathVariable("nickname") String nickname, Pageable pageable) {
		List<PostEntity> postList = postService.getPostList(nickname);
		Page<PostSimpleResponseDto> postSimpleResponseDtoPage = PostSimpleResponseDto.fromEntityPage(postList, feedService::getCommentCount, pageable);
		return ResponseEntity.ok().body(ResultDto.of(postSimpleResponseDtoPage));
	}


	@GetMapping("/{postId}")
	@ApiOperation(value = "게시글 상세 내용을 조회합니다.")
	public ResponseEntity<ResultDto<PostResponseDto>> getPost(@PathVariable("postId") Long postId) {
		PostEntity post = postService.getPost(postId);
		PostResponseDto postResponseDto = PostResponseDto.fromEntity(post, feedService::getCommentCount, feedService::getTagContentList, followService::isFollowed, feedService::isLikedFeed);
		return ResponseEntity.ok().body(ResultDto.of(postResponseDto));
	}


	@PostMapping
	@ApiOperation(value = "게시글을 생성합니다.")
	public ResponseEntity<ResultDto<Long>> createPost(PostRequestDto postRequestDto) {
		Long postId = postService.createPost(postRequestDto);
		return ResponseEntity.ok().body(ResultDto.of(postId));
	}


	@PutMapping("/{postId}")
	@ApiOperation(value = "게시글을 수정합니다.")
	public ResponseEntity<ResultDto<Boolean>> modifyPost(@PathVariable("postId") Long postId, PostRequestDto postRequestDto) {
		postService.modifyPost(postId, postRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{postId}")
	@ApiOperation(value = "게시글을 삭제합니다.")
	public ResponseEntity<ResultDto<Boolean>> deletePost(@PathVariable("postId") Long postId) {
		postService.deletePost(postId);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
