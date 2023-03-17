package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


@Data
@JsonAutoDetect // unit test시 object mapper에서 사용
public class ProfileResponseDto implements Serializable {

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
