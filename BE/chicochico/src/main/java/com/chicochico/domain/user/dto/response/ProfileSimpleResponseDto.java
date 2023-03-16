package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class ProfileSimpleResponseDto {

	public static ProfileSimpleResponseDto fromEntity(UserEntity xx) {
		return new ProfileSimpleResponseDto();
	}


	public static List<ProfileSimpleResponseDto> fromEnityList(List<UserEntity> xxList) {
		List<ProfileSimpleResponseDto> result = new ArrayList<>();
		for (UserEntity xx : xxList) {
			ProfileSimpleResponseDto xxResponseDto = ProfileSimpleResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
