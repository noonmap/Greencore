package com.chicochico.domain.feed.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.feed.dto.response.CommentMentionResponseDto;
import com.chicochico.domain.feed.service.CommentService;
import com.chicochico.domain.user.entity.UserEntity;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/mention")
@RequiredArgsConstructor
@Api(tags = "댓글 내 멘션 API") // Swagger 문서의 대분류 항목을 써줌
public class CommentMentionController {

	private final CommentService commentService;


	@GetMapping("/{userId}")
	@ApiOperation(value = "선택한 mention 유저 정보 반환한다.", notes = "")
	public ResponseEntity<ResultDto<CommentMentionResponseDto>> getMentionUser(@PathVariable Long userId) {
		UserEntity user = commentService.getMentionUser(userId);
		CommentMentionResponseDto followResponseDto = CommentMentionResponseDto.fromEntity(user);
		return ResponseEntity.ok().body(ResultDto.of(followResponseDto));
	}


	@GetMapping
	@ApiOperation(value = "글자가 포함된 팔로잉한 유저 리스트를 반환한다.", notes = "")
	public ResponseEntity<ResultDto<List<CommentMentionResponseDto>>> getMentionUserList(@RequestParam String nickname) {
		List<UserEntity> followList = commentService.getMentionUserList(nickname);
		List<CommentMentionResponseDto> followResponseDto = CommentMentionResponseDto.fromEntityList(followList);
		return ResponseEntity.ok().body(ResultDto.of(followResponseDto));
	}

}
