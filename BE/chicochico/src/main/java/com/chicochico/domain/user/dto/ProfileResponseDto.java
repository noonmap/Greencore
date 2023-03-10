package com.chicochico.domain.user.dto;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class ProfileResponseDto {

	public static ProfileResponseDto fromEntity(UserEntity xx) {
		return new ProfileResponseDto();
	}


	public static List<ProfileResponseDto> fromEnityList(List<UserEntity> xxList) {
		List<ProfileResponseDto> result = new ArrayList<>();
		for (UserEntity xx : xxList) {
			ProfileResponseDto xxResponseDto = ProfileResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
