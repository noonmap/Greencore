package com.chicochico.domain.user.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 이메일 인증 코드 확인
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthCodeRequestDto {

	private String authCode;

}