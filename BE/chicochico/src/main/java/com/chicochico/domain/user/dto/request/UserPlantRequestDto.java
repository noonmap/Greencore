package com.chicochico.domain.user.dto.request;


import com.chicochico.domain.user.entity.UserPlantEntity;


/**
 * 사용자가 키우는 식물 생성 요청
 */
public class UserPlantRequestDto {

	public UserPlantEntity toEntity() {
		return (UserPlantEntity) new Object();
	}

}
