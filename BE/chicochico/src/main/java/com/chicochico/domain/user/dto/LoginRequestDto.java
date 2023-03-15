package com.chicochico.domain.user.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 로그인 요청
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDto {

	private String email;
	private String password;

}