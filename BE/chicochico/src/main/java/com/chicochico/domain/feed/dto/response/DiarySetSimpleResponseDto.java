package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiarySetEntity;

import java.util.ArrayList;
import java.util.List;


public class DiarySetSimpleResponseDto {

	public static DiarySetSimpleResponseDto fromEntity(DiarySetEntity xx) {
		return new DiarySetSimpleResponseDto();
	}


	public static List<DiarySetSimpleResponseDto> fromEnityList(List<DiarySetEntity> xxList) {
		List<DiarySetSimpleResponseDto> result = new ArrayList<>();
		for (DiarySetEntity xx : xxList) {
			DiarySetSimpleResponseDto xxResponseDto = DiarySetSimpleResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
