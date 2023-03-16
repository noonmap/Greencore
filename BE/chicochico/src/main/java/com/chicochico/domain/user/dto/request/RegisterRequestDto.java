package com.chicochico.domain.user.dto.request;


import com.chicochico.domain.user.entity.UserEntity;


/**
 * 회원 가입
 */
public class RegisterRequestDto {

	public UserEntity toEntity() {
		return (UserEntity) new Object();
	}

}
