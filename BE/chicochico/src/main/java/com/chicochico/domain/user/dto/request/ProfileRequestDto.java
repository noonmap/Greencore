package com.chicochico.domain.user.dto.request;


import com.chicochico.domain.user.entity.UserEntity;


/**
 * 유저 프로필 정보 생성, 수정 요청
 */
public class ProfileRequestDto {

	public UserEntity toEntity() {
		return (UserEntity) new Object();
	}

}
