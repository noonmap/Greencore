package com.chicochico.domain.feed.dto;


import com.chicochico.domain.feed.entity.CommentEntity;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


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


	public static Page<CommentResponseDto> fromEnityPage(Page<CommentEntity> commentEntityPage,
		Pageable pageable) {
		return new PageImpl<>(
			commentEntityPage.stream().map(CommentResponseDto::fromEntity).collect(
				Collectors.toList()));
	}

}
