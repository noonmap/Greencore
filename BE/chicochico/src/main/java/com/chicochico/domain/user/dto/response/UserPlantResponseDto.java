package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class UserPlantResponseDto {

	public static UserPlantResponseDto fromEntity(UserPlantEntity xx) {
		return new UserPlantResponseDto();
	}


	public static List<UserPlantResponseDto> fromEnityList(List<UserPlantEntity> xxList) {
		List<UserPlantResponseDto> result = new ArrayList<>();
		for (UserPlantEntity xx : xxList) {
			UserPlantResponseDto xxResponseDto = UserPlantResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
