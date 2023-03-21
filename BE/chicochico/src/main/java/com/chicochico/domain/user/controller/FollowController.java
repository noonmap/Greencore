package com.chicochico.domain.user.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.user.dto.response.FollowResponseDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.service.FollowService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@Api(tags = "팔로우 API")
public class FollowController {

	private final FollowService followService;


	@PostMapping("/following/{nickname}")
	@ApiOperation(value = "필로잉합니다. (팔로잉 생성)", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createFollowing(@PathVariable("nickname") String nickname) {
		followService.createFollowing(nickname);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/following/{nickname}")
	@ApiOperation(value = "팔로잉 목록을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<List<FollowResponseDto>>> getFollowingList(@PathVariable("nickname") String nickname) {
		List<UserEntity> followList = followService.getFollowingList(nickname);
		List<FollowResponseDto> followResponseDtoList = FollowResponseDto.fromEnityList(followList);

		return ResponseEntity.ok().body(ResultDto.of(followResponseDtoList));
	}


	@DeleteMapping("/following/{nickname}")
	@ApiOperation(value = "팔로잉을 삭제합니다. (언팔로우)", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteFollowing(@PathVariable("nickname") String nickname) {
		followService.deleteFollowing(nickname);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/follower/{nickname}")
	@ApiOperation(value = "팔로워 목록을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<List<FollowResponseDto>>> getFollowerList(@PathVariable("nickname") String nickname) {
		List<UserEntity> followList = followService.getFollowerList(nickname);
		List<FollowResponseDto> followResponseDtoList = FollowResponseDto.fromEnityList(followList);

		return ResponseEntity.ok().body(ResultDto.of(followResponseDtoList));
	}


	@DeleteMapping("/follower/{nickname}")
	@ApiOperation(value = "팔로워를 삭제합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteFollower(@PathVariable("nickname") String nickname) {
		followService.deleteFollower(nickname);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
