package com.chicochico.domain.user.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

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


	public static Page<FollowResponseDto> fromEntityPage(Page<UserEntity> page, Function<Long, Boolean> isFollowed) {
		List<UserEntity> userList = new ArrayList<>(page.toList());
		List<FollowResponseDto> postSimpleResponseDtoList = fromEnityList(userList, isFollowed);
		Page<FollowResponseDto> result = new PageImpl<>(postSimpleResponseDtoList, page.getPageable(), postSimpleResponseDtoList.size());
		return result;
	}

}