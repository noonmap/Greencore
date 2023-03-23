package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


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
			.plantImagePath(userPlant.getPlantImagePath())
			.build();
	}


	public static List<UserPlantResponseDto> fromEnityList(List<UserPlantEntity> userPlantList) {
		List<UserPlantResponseDto> result = new ArrayList<>();
		for (UserPlantEntity userPlant : userPlantList) {
			UserPlantResponseDto userPlantResponseDto = UserPlantResponseDto.fromEntity(userPlant);
			result.add(userPlantResponseDto);
		}
		return result;
	}

}
