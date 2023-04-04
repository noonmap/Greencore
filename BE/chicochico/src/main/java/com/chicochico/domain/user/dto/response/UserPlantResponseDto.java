package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;


@Data
@Builder
public class UserPlantResponseDto {

	private Long userPlantId;
	private Long plantId;
	private String plantNickname;
	private String plantName;
	private String plantImagePath;


	public static UserPlantResponseDto fromEntity(UserPlantEntity userPlant) {
		return UserPlantResponseDto.builder()
			.userPlantId(userPlant.getId())
			.plantId(userPlant.getPlant().getId())
			.plantNickname(userPlant.getPlantNickname())
			.plantName(userPlant.getPlant().getName())
			.plantImagePath("/images/" + userPlant.getPlantImagePath())
			.build();
	}


	public static Page<UserPlantResponseDto> fromEnityPage(Page<UserPlantEntity> page) {
		Page<UserPlantResponseDto> result = page.map(UserPlantResponseDto::fromEntity);

		return result;
	}

}
