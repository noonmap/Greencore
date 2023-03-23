package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiaryEntity;

import java.util.ArrayList;
import java.util.List;


public class DiarySimpleResponseDto {

	public static DiarySimpleResponseDto fromEntity(DiaryEntity diary) {
		return new DiarySimpleResponseDto();
	}


	public static List<DiarySimpleResponseDto> fromEnityList(List<DiaryEntity> diaryList) {
		List<DiarySimpleResponseDto> result = new ArrayList<>();
		for (DiaryEntity diary : diaryList) {
			DiarySimpleResponseDto diarySimpleResponseDto = DiarySimpleResponseDto.fromEntity(diary);
			result.add(diarySimpleResponseDto);
		}
		return result;
	}

	//	public static Page<DiarySimpleResponseDto> fromEnityPage(Page<DiaryEntity> diaryEntityPage) {
	//	}

}
