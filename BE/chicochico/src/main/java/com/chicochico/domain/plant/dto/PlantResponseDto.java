package com.chicochico.domain.plant.dto;


import com.chicochico.domain.plant.entity.PlantEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class PlantResponseDto {

	public static PlantResponseDto fromEntity(PlantEntity xx) {
		return new PlantResponseDto();
	}


	public static List<PlantResponseDto> fromEnityList(List<PlantEntity> xxList) {
		List<PlantResponseDto> result = new ArrayList<>();
		for (PlantEntity xx : xxList) {
			PlantResponseDto xxResponseDto = PlantResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
