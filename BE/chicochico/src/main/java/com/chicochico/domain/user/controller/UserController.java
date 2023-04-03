package com.chicochico.domain.user.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.user.dto.request.PasswordRequestDto;
import com.chicochico.domain.user.dto.request.RegisterRequestDto;
import com.chicochico.domain.user.dto.request.UserPlantRequestDto;
import com.chicochico.domain.user.dto.request.UserPlantSimpleRequestDto;
import com.chicochico.domain.user.dto.response.UserPlantResponseDto;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.service.UserService;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@Log4j2
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Api(tags = "유저 API")
public class UserController {

	private final UserService userService;

	/*
	 * 유저 인증 관련
	 */


	@PostMapping
	@ApiOperation(value = "회원가입을 합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> signUp(@RequestBody RegisterRequestDto registerRequestDto) {
		userService.createUser(registerRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/{nickname}")
	@ApiOperation(value = "닉네임 중복확인을 합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> checkNickname(@PathVariable("nickname") String nickname) {
		Boolean checkNickname = userService.checkNickname(nickname);

		return ResponseEntity.ok().body(ResultDto.of(checkNickname));
	}


	@GetMapping("/email/{email}")
	@ApiOperation(value = "이메일 중복확인을 합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> checkEmail(@PathVariable("email") String email) {
		Boolean checkEmail = userService.checkEmail(email);

		return ResponseEntity.ok().body(ResultDto.of(checkEmail));
	}


	@PostMapping(value = "/password")
	@ApiOperation(value = "현재 비밀번호를 확인합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> checkPassword(@RequestBody PasswordRequestDto passwordRequestDto) {
		Boolean checkPassword = userService.checkPassword(passwordRequestDto);

		return ResponseEntity.ok().body(ResultDto.of(checkPassword));
	}


	@PutMapping("/password")
	@ApiOperation(value = "비밀번호를 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyPassword(@RequestBody PasswordRequestDto passwordRequestDto) {
		userService.modifyPassword(passwordRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping
	@ApiOperation(value = "회원탈퇴를 합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteUser(@RequestHeader Map<String, String> logoutRequestHeader) {
		userService.deleteUser(logoutRequestHeader);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	/*
	 * 유저 정보 (내키식) 관련
	 */


	@GetMapping("/plant/{nickname}/{userPlantId}")
	@ApiOperation(value = "유저가 키우는 식물을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<UserPlantResponseDto>> getUserPlant(@PathVariable("nickname") String nickname, @PathVariable("userPlantId") Long userPlantId) {
		UserPlantEntity userPlant = userService.getUserPlant(nickname, userPlantId);
		UserPlantResponseDto userPlantResponseDto = UserPlantResponseDto.fromEntity(userPlant);

		return ResponseEntity.ok().body(ResultDto.of(userPlantResponseDto));
	}


	@GetMapping("/plant/{nickname}")
	@ApiOperation(value = "유저가 키우는 식물 목록을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<UserPlantResponseDto>>> getUserPlantList(@PathVariable("nickname") String nickname, Pageable pageable) {
		Page<UserPlantEntity> userPlantEntityList = userService.getUserPlantList(nickname, pageable);
		Page<UserPlantResponseDto> userPlantResponseDtoList = UserPlantResponseDto.fromEnityPage(userPlantEntityList);

		int page = pageable.getPageNumber();
		if (page != 0 && userPlantResponseDtoList.getTotalPages() <= page) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

		return ResponseEntity.ok().body(ResultDto.of(userPlantResponseDtoList));
	}


	@PostMapping("/plant")
	@ApiOperation(value = "내가 키우는 식물 생성합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createUserPlant(@RequestBody UserPlantRequestDto userPlantRequestDto) {
		userService.createUserPlant(userPlantRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/plant/{userPlantId}")
	@ApiOperation(value = "내가 키우는 식물 닉네임을 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyUserPlant(@PathVariable("userPlantId") Long userPlantId, @RequestBody UserPlantSimpleRequestDto userPlantSimpleRequestDto) {
		userService.modifyUserPlant(userPlantId, userPlantSimpleRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/plant/{userPlantId}")
	@ApiOperation(value = "내가 키우는 식물을 삭제합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteUserPlant(@PathVariable("userPlantId") Long userPlantId) {
		userService.deleteUserPlant(userPlantId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
