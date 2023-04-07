package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

import static com.chicochico.common.service.FileService.NGINX_PATH;


@Data
@Builder
@AllArgsConstructor
public class ProfileSimpleResponseDto {

	private String nickname;

	private String profileImagePath;


	public static ProfileSimpleResponseDto fromEntity(UserEntity user) {
		String path = user.getProfileImagePath();
		if (!path.startsWith("http")) {
			path = NGINX_PATH + path;
		}
		return new ProfileSimpleResponseDto(user.getNickname(), path);
	}


	public static List<ProfileSimpleResponseDto> fromEnityList(List<UserEntity> userList) {
		List<ProfileSimpleResponseDto> result = new ArrayList<>();
		for (UserEntity user : userList) {
			ProfileSimpleResponseDto xxResponseDto = ProfileSimpleResponseDto.fromEntity(user);
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<ProfileSimpleResponseDto> fromEnityPage(Page<UserEntity> userPage) {
		Page<ProfileSimpleResponseDto> result = userPage.map(ProfileSimpleResponseDto::fromEntity);
		return result;
	}

}
