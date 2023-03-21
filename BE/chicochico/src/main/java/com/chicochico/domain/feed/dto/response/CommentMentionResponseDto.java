package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.user.entity.FollowEntity;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;


@Data
@Builder
public class CommentMentionResponseDto {

	private Long userId;
	private String nickname;


	public static CommentMentionResponseDto fromEntity(FollowEntity follow) {
		return CommentMentionResponseDto.builder()
			.userId(follow.getFollowing().getId())
			.nickname(follow.getFollowing().getNickname())
			.build();
	}


	public List<CommentMentionResponseDto> fromEntityList(List<FollowEntity> followList) {
		List<CommentMentionResponseDto> result;
		result = followList.stream().map(CommentMentionResponseDto::fromEntity).collect(Collectors.toList());
		return result;
	}

}
