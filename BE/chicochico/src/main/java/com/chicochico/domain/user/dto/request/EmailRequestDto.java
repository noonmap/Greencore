package com.chicochico.domain.user.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 이메일 인증 요청
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequestDto {

	private String email;

}