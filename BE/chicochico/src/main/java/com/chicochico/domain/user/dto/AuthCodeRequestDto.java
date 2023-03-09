package com.chicochico.domain.user.dto;


import com.chicochico.domain.user.entity.UserEntity;


/**
 * 이메일 인증 코드 확인
 */
public class AuthCodeRequestDto {

	public UserEntity toEntity() {
		return (UserEntity) new Object();
	}

}
