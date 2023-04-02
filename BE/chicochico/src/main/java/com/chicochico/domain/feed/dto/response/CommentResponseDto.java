package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.CommentEntity;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;


@Data
public class CommentResponseDto {

	public static CommentResponseDto fromEntity(CommentEntity commentEntity) {
		return new CommentResponseDto();
	}

	//stream().map() 써서 코드 예쁘게 하는 법

	//	public static List<CommentResponseDto> fromEnityList(List<CommentEntity> commentEntityList) {
	//		List<CommentResponseDto> result;
	//		result = commentEntityList.stream().map(CommentResponseDto::fromEntity)
	//			.collect(Collectors.toList());
	//
	//		return result;
	//	}


	public static List<CommentResponseDto> fromEnityList(List<CommentEntity> commentEntityList) {
		List<CommentResponseDto> result = new ArrayList<>();
		for (CommentEntity comment : commentEntityList) {
			CommentResponseDto commentResponseDto = CommentResponseDto.fromEntity(comment);
			result.add(commentResponseDto);
		}
		return result;
	}


	public static Page<CommentResponseDto> fromEnityPage(Page<CommentEntity> commentEntityPage) {
		Page<CommentResponseDto> result = commentEntityPage.map(CommentResponseDto::fromEntity);
		return result;
	}

}
