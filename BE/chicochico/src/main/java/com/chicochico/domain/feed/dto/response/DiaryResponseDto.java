package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiaryEntity;

import java.util.ArrayList;
import java.util.List;


public class DiaryResponseDto {

	public static DiaryResponseDto fromEntity(DiaryEntity diary) {
		return new DiaryResponseDto();
	}


	public static List<DiaryResponseDto> fromEnityList(List<DiaryEntity> diaryList) {
		List<DiaryResponseDto> result = new ArrayList<>();
		for (DiaryEntity diary : diaryList) {
			DiaryResponseDto diaryResponseDto = DiaryResponseDto.fromEntity(diary);
			result.add(diaryResponseDto);
		}
		return result;
	}

}
