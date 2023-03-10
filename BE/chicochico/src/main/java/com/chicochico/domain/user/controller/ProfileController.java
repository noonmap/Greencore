package com.chicochico.domain.user.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.user.dto.ProfileRequestDto;
import com.chicochico.domain.user.dto.ProfileResponseDto;
import com.chicochico.domain.user.dto.ProfileSimpleResponseDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.service.ProfileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Api(tags = "유저 프로필 정보 API")
public class ProfileController {

	private final ProfileService profileService;


	@GetMapping("/{nickname}")
	@ApiOperation(value = "프로필을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<ProfileResponseDto>> getUserProfile(@PathVariable String nickname) {
		UserEntity userProfile = profileService.getUserProfile(nickname);
		ProfileResponseDto profileResponseDto = ProfileResponseDto.fromEntity(userProfile);

		return ResponseEntity.ok().body(ResultDto.of(profileResponseDto));
	}


	@PutMapping
	@ApiOperation(value = "프로필을 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyUserProfile(@RequestBody ProfileRequestDto profileRequestDto) {
		profileService.modifyUserProfile(profileRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/image")
	@ApiOperation(value = "프로필 이미지를 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyUserProfileImage(@RequestPart("profileImage") MultipartFile profileImage) {
		profileService.modifyUserProfileImage(profileImage);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping
	@ApiOperation(value = "사용자를 검색합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<ProfileSimpleResponseDto>>> getUserProfileList(@RequestParam("search") String search, Pageable pageable) {
		Page<UserEntity> userProfileList = profileService.getUserProfileList(search, pageable);
		// TODO : entity page -> dto page 변환 추가

		return ResponseEntity.ok().body(ResultDto.of(Page.empty()));
	}


	@GetMapping("/plant")
	@ApiOperation(value = " 나와 같은 식물을 키우는 사람들 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<List<ProfileSimpleResponseDto>>> getSamePlantUserProfileList() {
		List<UserEntity> userProfile = profileService.getSamePlantUserProfileList();
		List<ProfileSimpleResponseDto> profileSimpleResponseDtoList = ProfileSimpleResponseDto.fromEnityList(userProfile);

		return ResponseEntity.ok().body(ResultDto.of(profileSimpleResponseDtoList));
	}

}
