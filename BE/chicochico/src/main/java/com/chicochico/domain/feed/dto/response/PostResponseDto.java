package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.PostEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class PostResponseDto {

	public static PostResponseDto fromEntity(PostEntity xx) {
		return new PostResponseDto();
	}


	public static List<PostResponseDto> fromEnityList(List<PostEntity> xxList) {
		List<PostResponseDto> result = new ArrayList<>();
		for (PostEntity xx : xxList) {
			PostResponseDto xxResponseDto = PostResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
