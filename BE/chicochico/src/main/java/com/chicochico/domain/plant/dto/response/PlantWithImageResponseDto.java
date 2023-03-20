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


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantWithImageResponseDto {

	private Long plantId;
	private String imagePath;
	private String plantName;


	public static PlantWithImageResponseDto fromEntity(PlantEntity xx) {
		PlantWithImageResponseDto plantWithImageResponseDto = PlantWithImageResponseDto.builder()
			.plantId(xx.getId())
			.imagePath(xx.getImagePath())
			.plantName(xx.getName())
			.build();
		return plantWithImageResponseDto;
	}


	public static List<PlantWithImageResponseDto> fromEnityList(List<PlantEntity> xxList) {
		List<PlantWithImageResponseDto> result = new ArrayList<>();
		for (PlantEntity xx : xxList) {
			PlantWithImageResponseDto xxResponseDto = PlantWithImageResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<PlantWithImageResponseDto> fromEnityPage(Page<PlantEntity> xxList, Pageable pageable) {
		List<PlantWithImageResponseDto> result = new ArrayList<>();
		for (PlantEntity xx : xxList) {
			PlantWithImageResponseDto xxResponseDto = PlantWithImageResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		Page<PlantWithImageResponseDto> resultPage = new PageImpl<>(result, pageable, result.size());

		return resultPage;
	}

}
