package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.CommentEntity;
import com.chicochico.domain.user.dto.response.ProfileSimpleResponseDto;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;


@Data
@Builder
public class CommentResponseDto {

	private Long commentId;
	private ProfileSimpleResponseDto user;
	private String content;
	private String mentionNickname;
	private LocalDateTime createdAt;


	public static CommentResponseDto fromEntity(CommentEntity commentEntity, Function<CommentEntity, String> findMentionNickname) {

		return CommentResponseDto.builder()
			.commentId(commentEntity.getId())
			.content(commentEntity.getContent())
			.user(ProfileSimpleResponseDto.fromEntity(commentEntity.getUser()))
			.mentionNickname(findMentionNickname.apply(commentEntity))
			.createdAt(commentEntity.getCreatedAt())
			.build();
	}

	//stream().map() 써서 코드 예쁘게 하는 법

	//	public static List<CommentResponseDto> fromEnityList(List<CommentEntity> commentEntityList) {
	//		List<CommentResponseDto> result;
	//		result = commentEntityList.stream().map(CommentResponseDto::fromEntity)
	//			.collect(Collectors.toList());
	//
	//		return result;
	//	}


	public static List<CommentResponseDto> fromEnityList(List<CommentEntity> commentEntityList, Function<CommentEntity, String> findMentionNickname) {
		List<CommentResponseDto> result = new ArrayList<>();
		for (CommentEntity comment : commentEntityList) {
			CommentResponseDto commentResponseDto = CommentResponseDto.fromEntity(comment, findMentionNickname);
			result.add(commentResponseDto);
		}
		return result;
	}


	public static Page<CommentResponseDto> fromEnityPage(Page<CommentEntity> commentEntityPage, Function<CommentEntity, String> findMentionNickname) {
		Page<CommentResponseDto> result = commentEntityPage.map((comment) -> CommentResponseDto.fromEntity(comment, findMentionNickname));
		return result;
	}

}
