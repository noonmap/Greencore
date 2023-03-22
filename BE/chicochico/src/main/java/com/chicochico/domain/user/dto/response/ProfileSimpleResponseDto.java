package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Data
@Builder
@AllArgsConstructor
public class ProfileSimpleResponseDto {

	private String nickname;

	private String profileImagePath;


	public static ProfileSimpleResponseDto fromEntity(UserEntity user) {
		return new ProfileSimpleResponseDto(user.getNickname(), user.getProfileImagePath());
	}


	public static List<ProfileSimpleResponseDto> fromEnityList(List<UserEntity> userList) {
		List<ProfileSimpleResponseDto> result = new ArrayList<>();
		for (UserEntity user : userList) {
			ProfileSimpleResponseDto xxResponseDto = ProfileSimpleResponseDto.fromEntity(user);
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<ProfileSimpleResponseDto> fromEnityPage(Page<UserEntity> userPage, Pageable pageable) {
		List<ProfileSimpleResponseDto> result = userPage.stream().map(ProfileSimpleResponseDto::fromEntity).collect(Collectors.toList());
		return new PageImpl<>(result, pageable, result.size());
	}

}
