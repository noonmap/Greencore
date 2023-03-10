package com.chicochico.domain.plant.dto;


import com.chicochico.domain.plant.entity.PlantEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class PlantWithImageResponseDto {

	public static PlantWithImageResponseDto fromEntity(PlantEntity xx) {
		return new PlantWithImageResponseDto();
	}


	public static List<PlantWithImageResponseDto> fromEnityList(List<PlantEntity> xxList) {
		List<PlantWithImageResponseDto> result = new ArrayList<>();
		for (PlantEntity xx : xxList) {
			PlantWithImageResponseDto xxResponseDto = PlantWithImageResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
