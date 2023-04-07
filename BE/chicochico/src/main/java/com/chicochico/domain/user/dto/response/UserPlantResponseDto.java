package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import static com.chicochico.common.service.FileService.NGINX_PATH;


@Data
@Builder
public class UserPlantResponseDto {

	private Long userPlantId;
	private Long plantId;
	private String plantNickname;
	private String plantName;
	private String plantImagePath;


	public static UserPlantResponseDto fromEntity(UserPlantEntity userPlant) {
		String path = userPlant.getPlantImagePath();
		if (!path.startsWith("http")) {
			path = NGINX_PATH + path;
		}
		return UserPlantResponseDto.builder()
			.userPlantId(userPlant.getId())
			.plantId(userPlant.getPlant().getId())
			.plantNickname(userPlant.getPlantNickname())
			.plantName(userPlant.getPlant().getName())
			.plantImagePath(path)
			.build();
	}


	public static Page<UserPlantResponseDto> fromEnityPage(Page<UserPlantEntity> page) {
		Page<UserPlantResponseDto> result = page.map(UserPlantResponseDto::fromEntity);

		return result;
	}

}
