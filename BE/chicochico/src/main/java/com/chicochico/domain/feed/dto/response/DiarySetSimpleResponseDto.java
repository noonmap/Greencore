package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiarySetEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static com.chicochico.common.service.FileService.NGINX_PATH;


@Data
@Builder
public class DiarySetSimpleResponseDto {

	private Long diarySetId;
	private LocalDate startDate;
	private String imagePath;
	private String title;


	public static DiarySetSimpleResponseDto fromEntity(DiarySetEntity diarySet) {

		String path = diarySet.getImagePath();
		if (!path.startsWith("http")) {
			path = NGINX_PATH + path;
		}
		return DiarySetSimpleResponseDto.builder()
			.diarySetId(diarySet.getId())
			.startDate(diarySet.getCreatedAt().toLocalDate())
			.imagePath(path)
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
