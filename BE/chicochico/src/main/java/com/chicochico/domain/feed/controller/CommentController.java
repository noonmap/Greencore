package com.chicochico.domain.feed.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.feed.dto.request.CommentRequestDto;
import com.chicochico.domain.feed.dto.response.CommentResponseDto;
import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.feed.service.CommentService;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
@Api(tags = "댓글 API") // Swagger 문서의 대분류 항목을 써줌
public class CommentController {

	private final CommentService service;


	@GetMapping("/{feedId}/comment")
	@ApiOperation(value = "해당 피드의 댓글을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<CommentResponseDto>>> getCommentList(@PathVariable Long feedId, Pageable pageable) {
		Page<CommentEntity> commentList = service.getCommentList(feedId, pageable);
		//entity page를 dto page로 변환 필요합니다.
		Page<CommentResponseDto> responseDto = CommentResponseDto.fromEnityPage(commentList, service::findMentionNickname);

		int page = pageable.getPageNumber();
		if (page != 0 && responseDto.getTotalPages() <= page) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

		return ResponseEntity.status(HttpStatus.OK).body(ResultDto.of(responseDto));
	}


	@PostMapping("/{feedId}/comment")
	@ApiOperation(value = "해당 피드에 댓글을 생성합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createComment(@PathVariable Long feedId, @RequestBody CommentRequestDto commentRequestDto) {
		service.createComment(feedId, commentRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/{feedId}/comment/{commentId}")
	@ApiOperation(value = "해당 댓글을 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyComment(@PathVariable Long feedId, @PathVariable Long commentId, @RequestBody CommentRequestDto commentRequestDto) {
		service.modifyComment(commentId, commentRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{feedId}/comment/comment/{commentId}")
	@ApiOperation(value = "해당 댓글을 삭제합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteComment(@PathVariable Long feedId, @PathVariable Long commentId) {
		service.deleteComment(commentId);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
