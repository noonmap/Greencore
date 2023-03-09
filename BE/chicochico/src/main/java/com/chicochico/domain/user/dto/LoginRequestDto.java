package com.chicochico.domain.user.dto;


import com.chicochico.domain.user.entity.UserEntity;


/**
 * 로그인 요청
 */
public class LoginRequestDto {

	public UserEntity toEntity() {
		return (UserEntity) new Object();
	}

}
