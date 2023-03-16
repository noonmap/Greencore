package com.chicochico.domain.user.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 비밀번호 확인 및 수정 요청
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordRequestDto {

	private String password;

}
