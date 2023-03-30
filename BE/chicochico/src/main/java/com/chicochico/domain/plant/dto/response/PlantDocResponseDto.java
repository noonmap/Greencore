package com.chicochico.domain.plant.dto.response;


import com.chicochico.domain.plant.entity.PlantEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlantDocResponseDto {

	private Long plantId;
	private String plantName;
	private String specificName;
	private String water;
	private String light;
	private String humidity;
	private String temperature;
	private String imagePath;


	public static PlantDocResponseDto fromEntity(PlantEntity xx) {
		PlantDocResponseDto plantDocResponseDto = PlantDocResponseDto.builder()
			.plantId(xx.getId()).plantName(xx.getName())
			.specificName(xx.getSpecificName()).water(xx.getWater())
			.light(xx.getLight()).humidity(xx.getHumidity())
			.temperature(xx.getTemperature()).imagePath(xx.getImagePath()).build();
		return plantDocResponseDto;
	}

}
