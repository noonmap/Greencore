package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;


@Data
@Builder
public class FollowResponseDto {

	private String nickname;

	private String profileImagePath;

	private String introduction;

	private Boolean isFollowed;


	public static FollowResponseDto fromEntity(UserEntity user, Function<Long, Boolean> isFollowed) {
		return FollowResponseDto.builder()
			.nickname(user.getNickname())
			.profileImagePath(user.getProfileImagePath())
			.introduction(user.getIntroduction())
			.isFollowed(isFollowed.apply(user.getId()))
			.build();
	}


	public static List<FollowResponseDto> fromEnityList(List<UserEntity> userList, Function<Long, Boolean> isFollowed) {
		List<FollowResponseDto> result = new ArrayList<>();
		for (UserEntity user : userList) {
			FollowResponseDto xxResponseDto = FollowResponseDto.fromEntity(user, isFollowed);
			result.add(xxResponseDto);
		}
		return result;
	}

}