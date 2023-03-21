package com.chicochico.domain.plant.dto.response;


import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class PlantOnScheduleResponseDto {

	private Long plantId;
	private Long userPlantId;
	private String plantNickname;


	public static PlantOnScheduleResponseDto fromEntity(UserPlantEntity plantEntity) {
		PlantOnScheduleResponseDto plant = PlantOnScheduleResponseDto.builder()
			.userPlantId(plantEntity.getId())
			.plantNickname(plantEntity.getPlantNickname())
			.plantId(plantEntity.getId())
			.build();
		return plant;
	}

}
