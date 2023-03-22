package com.chicochico.domain.user.dto.request;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Builder;
import lombok.Data;


/**
 * 사용자가 키우는 식물 생성 요청
 */
@Builder
@Data
public class UserPlantRequestDto {

	private Long plantId;
	private String plantNickname;


	public UserPlantEntity toEntity(UserEntity user, PlantEntity plant) {
		return UserPlantEntity.builder()
			.user(user)
			.plant(plant)
			.plantNickname(plantNickname)
			.plantImagePath(plant.getImagePath())
			.isDeleted(IsDeletedType.N)
			.build();
	}

}
