package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class FollowResponseDto {

	public static FollowResponseDto fromEntity(UserEntity xx) {
		return new FollowResponseDto();
	}


	public static List<FollowResponseDto> fromEnityList(List<UserEntity> xxList) {
		List<FollowResponseDto> result = new ArrayList<>();
		for (UserEntity xx : xxList) {
			FollowResponseDto xxResponseDto = FollowResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
