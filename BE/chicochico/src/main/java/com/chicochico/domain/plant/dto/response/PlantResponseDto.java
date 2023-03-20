package com.chicochico.domain.plant.dto.response;


import com.chicochico.domain.plant.entity.PlantEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


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


	public static Page<PlantResponseDto> fromEnityPage(Page<PlantEntity> xxList, Pageable pageable) {
		List<PlantResponseDto> result = xxList.stream().map(PlantResponseDto::fromEntity).collect(Collectors.toList());

		Page<PlantResponseDto> resultPage = new PageImpl<>(result, pageable, result.size());
		return resultPage;
	}

}
