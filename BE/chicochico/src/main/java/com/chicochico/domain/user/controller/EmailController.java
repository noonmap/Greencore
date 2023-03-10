package com.chicochico.domain.user.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.user.dto.AuthCodeRequestDto;
import com.chicochico.domain.user.dto.EmailRequestDto;
import com.chicochico.domain.user.service.EmailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/mail")
@RequiredArgsConstructor
@Api(tags = "유저 이메일 API")
public class EmailController {

	private final EmailService emailService;


	@PostMapping("/")
	@ApiOperation(value = "인증 이메일을 발송합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> sendVerificationEmail(@RequestBody EmailRequestDto emailRequestDto) {
		emailService.sendVerificationEmail(emailRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PostMapping("/confirm")
	@ApiOperation(value = "이메일 인증을 확인합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> confirmEmail(@RequestBody AuthCodeRequestDto authCodeRequestDto) {
		emailService.confirmEmail(authCodeRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PostMapping("/password")
	@ApiOperation(value = "임시 비밀번호를 전송합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> sendTemporaryPassword(@RequestBody EmailRequestDto emailRequestDto) {
		emailService.sendTemporaryPassword(emailRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
