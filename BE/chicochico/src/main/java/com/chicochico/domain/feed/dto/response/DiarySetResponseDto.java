package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiarySetEntity;

import java.util.ArrayList;
import java.util.List;


public class DiarySetResponseDto {

	public static DiarySetResponseDto fromEntity(DiarySetEntity xx) {
		return new DiarySetResponseDto();
	}


	public static List<DiarySetResponseDto> fromEnityList(List<DiarySetEntity> xxList) {
		List<DiarySetResponseDto> result = new ArrayList<>();
		for (DiarySetEntity xx : xxList) {
			DiarySetResponseDto xxResponseDto = DiarySetResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}

}
