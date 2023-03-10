package com.chicochico.domain.feed.dto;


import com.chicochico.domain.feed.entity.FeedEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class FeedSimpleResponseDto {

	public static FeedSimpleResponseDto fromEntity(FeedEntity xx) {
		return new FeedSimpleResponseDto();
	}


	public static List<FeedSimpleResponseDto> fromEnityList(List<FeedEntity> xxList) {
		List<FeedSimpleResponseDto> result = new ArrayList<>();
		for (FeedEntity xx : xxList) {
			FeedSimpleResponseDto xxResponseDto = FeedSimpleResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
