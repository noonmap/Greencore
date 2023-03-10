package com.chicochico.domain.plant.dto;


import com.chicochico.domain.plant.entity.PlantEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class PlantDocResponseDto {

	public static PlantDocResponseDto fromEntity(PlantEntity xx) {
		return new PlantDocResponseDto();
	}


	public static List<PlantDocResponseDto> fromEnityList(List<PlantEntity> xxList) {
		List<PlantDocResponseDto> result = new ArrayList<>();
		for (PlantEntity xx : xxList) {
			PlantDocResponseDto xxResponseDto = PlantDocResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
