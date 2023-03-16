package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.FeedEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class FeedResponseDto {

	public static FeedResponseDto fromEntity(FeedEntity xx) {
		return new FeedResponseDto();
	}


	public static List<FeedResponseDto> fromEnityList(List<FeedEntity> xxList) {
		List<FeedResponseDto> result = new ArrayList<>();
		for (FeedEntity xx : xxList) {
			FeedResponseDto xxResponseDto = FeedResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
