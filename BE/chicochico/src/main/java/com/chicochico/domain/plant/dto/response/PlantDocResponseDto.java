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
	private String habitat;
	private String temperature;
	private String water;
	private String sunlight;
	private String specificName;
	private String origin;
	private String rootForm;
	private String managementLevel;
	private String placement;
	private String light;
	private String growthRate;
	private String growthType;
	private String imagePath;


	public static PlantDocResponseDto fromEntity(PlantEntity xx) {
		PlantDocResponseDto plantDocResponseDto = PlantDocResponseDto.builder()
			.plantId(xx.getId()).plantName(xx.getName())
			.habitat(xx.getHabitat()).temperature(xx.getTemperature())
			.water(xx.getWater()).sunlight(xx.getSunlight())
			.specificName(xx.getSpecificName()).origin(xx.getOrigin())
			.rootForm(xx.getRootForm()).managementLevel(xx.getManagementLevel())
			.placement(xx.getPlacement()).light(xx.getLight())
			.growthRate(xx.getGrowthRate()).growthType(xx.getGrowthType())
			.imagePath(xx.getImagePath()).build();
		return plantDocResponseDto;
	}

}
