package com.chicochico.domain.user.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.user.dto.request.AuthCodeRequestDto;
import com.chicochico.domain.user.dto.request.EmailRequestDto;
import com.chicochico.domain.user.service.EmailService;
import com.chicochico.domain.user.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Log4j2
@RestController
@RequestMapping("/mail")
@RequiredArgsConstructor
@Api(tags = "유저 이메일 API")
public class EmailController {

	private final EmailService emailService;
	private final UserService userService;


	@PostMapping
	@ApiOperation(value = "인증 이메일을 발송합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> sendVerificationEmail(@RequestBody EmailRequestDto emailRequestDto) {
		Boolean checkEmail = userService.checkEmail(emailRequestDto.getEmail());
		if (!checkEmail) {
			return ResponseEntity.ok().body(ResultDto.ofFail());
		}
		emailService.sendVerificationEmail(emailRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PostMapping("/confirm")
	@ApiOperation(value = "이메일 인증을 확인합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> confirmEmail(@RequestBody AuthCodeRequestDto authCodeRequestDto) {
		Boolean confirmEmail = emailService.confirmEmail(authCodeRequestDto);

		return ResponseEntity.ok().body(ResultDto.of(confirmEmail));
	}


	@PostMapping("/password")
	@ApiOperation(value = "임시 비밀번호를 전송합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> sendTemporaryPassword(@RequestBody EmailRequestDto emailRequestDto) {
		emailService.sendTemporaryPassword(emailRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}