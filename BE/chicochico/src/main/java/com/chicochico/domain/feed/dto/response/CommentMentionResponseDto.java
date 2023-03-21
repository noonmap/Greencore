package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;


@Data
@Builder
public class CommentMentionResponseDto {

	private Long userId;
	private String nickname;


	public static CommentMentionResponseDto fromEntity(UserEntity user) {
		return CommentMentionResponseDto.builder()
			.userId(user.getId())
			.nickname(user.getNickname())
			.build();
	}


	public static List<CommentMentionResponseDto> fromEntityList(List<UserEntity> userList) {
		List<CommentMentionResponseDto> result;
		result = userList.stream().map(CommentMentionResponseDto::fromEntity).collect(Collectors.toList());
		return result;
	}

}
