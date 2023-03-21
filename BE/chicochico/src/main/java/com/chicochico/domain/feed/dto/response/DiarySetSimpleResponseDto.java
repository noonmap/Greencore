package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiarySetEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Data
@Builder
public class DiarySetSimpleResponseDto {

	private Long diarySetId;
	private LocalDate startDate;
	private String imagePath;
	private String title;


	public static DiarySetSimpleResponseDto fromEntity(DiarySetEntity diarySet) {
		return DiarySetSimpleResponseDto.builder()
			.diarySetId(diarySet.getId())
			.startDate(diarySet.getCreatedAt().toLocalDate())
			.imagePath(diarySet.getImagePath())
			.title(diarySet.getTitle())
			.build();
	}


	public static List<DiarySetSimpleResponseDto> fromEnityList(List<DiarySetEntity> diarySetList) {
		List<DiarySetSimpleResponseDto> result = new ArrayList<>();
		for (DiarySetEntity diarySet : diarySetList) {
			DiarySetSimpleResponseDto diarySetResponseDto = DiarySetSimpleResponseDto.fromEntity(diarySet);
			result.add(diarySetResponseDto);
		}
		return result;
	}

}
