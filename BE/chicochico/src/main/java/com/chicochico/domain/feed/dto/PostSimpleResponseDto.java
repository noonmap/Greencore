package com.chicochico.domain.feed.dto;


import com.chicochico.domain.feed.entity.PostEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class PostSimpleResponseDto {

	public static PostSimpleResponseDto fromEntity(PostEntity xx) {
		return new PostSimpleResponseDto();
	}


	public static List<PostSimpleResponseDto> fromEnityList(List<PostEntity> xxList) {
		List<PostSimpleResponseDto> result = new ArrayList<>();
		for (PostEntity xx : xxList) {
			PostSimpleResponseDto xxResponseDto = PostSimpleResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
