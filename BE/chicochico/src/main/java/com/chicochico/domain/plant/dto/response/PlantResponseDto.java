package com.chicochico.domain.plant.dto.response;


import com.chicochico.domain.plant.entity.PlantEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlantResponseDto {

	private Long plantId;
	private String plantName;


	public static PlantResponseDto fromEntity(PlantEntity xx) {
		PlantResponseDto plantResponseDto = PlantResponseDto.builder()
			.plantId(xx.getId())
			.plantName(xx.getName())
			.build();
		return plantResponseDto;
	}


	public static List<PlantResponseDto> fromEnityList(List<PlantEntity> xxList) {
		List<PlantResponseDto> result = new ArrayList<>();
		for (PlantEntity xx : xxList) {
			PlantResponseDto xxResponseDto = PlantResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

	//	public static Page<PlantResponseDto> fromEnityPage(Page<PlantEntity> xxList) {
	//		List<PlantResponseDto> result = new ArrayList<>();
	//		for (PlantEntity xx : xxList) {
	//			PlantResponseDto xxResponseDto = PlantResponseDto.fromEntity(xx);
	//			result.add(xxResponseDto);
	//		}
	//		Page<PlantResponseDto> resultPage = new PageImpl<>(result);
	//
	//		return resultPage;
	//	}


	public static Page<PlantResponseDto> fromEnityPage(Page<PlantEntity> xxList) {
		Page<PlantResponseDto> result = xxList.map(PlantResponseDto::fromEntity);

		return result;
	}

}
