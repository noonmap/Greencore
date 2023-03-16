package com.chicochico.domain.user.dto.request;


import com.chicochico.domain.user.entity.UserPlantEntity;


/**
 * 사용자가 키우는 식물 닉네임 수정 요청
 */
public class UserPlantSimpleRequestDto {

	public UserPlantEntity toEntity() {
		return (UserPlantEntity) new Object();
	}

}
