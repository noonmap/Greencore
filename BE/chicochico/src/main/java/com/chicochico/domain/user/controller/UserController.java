package com.chicochico.domain.user.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.user.dto.PasswordRequestDto;
import com.chicochico.domain.user.dto.RegisterRequestDto;
import com.chicochico.domain.user.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Api(tags = "유저 API")
public class UserController {

	private final UserService userService;


	@PostMapping("/")
	@ApiOperation(value = "회원가입을 합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> signUp(@RequestBody RegisterRequestDto registerRequestDto) {
		userService.createUser(registerRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/{nickname}")
	@ApiOperation(value = "닉네임 중복확인을 합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> checkNickname(@PathVariable("nickname") String nickname) {
		userService.checkNickname(nickname);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PostMapping("/password")
	@ApiOperation(value = "현재 비밀번호를 확인합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> checkPassword(@RequestBody PasswordRequestDto passwordRequestDto) {
		userService.checkPassword(passwordRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/password")
	@ApiOperation(value = "비밀번호를 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyPassword(@RequestBody PasswordRequestDto passwordRequestDto) {
		userService.modifyPassword(passwordRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/")
	@ApiOperation(value = "회원탈퇴를 합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteUser() {
		userService.deleteUser();

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
