package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.user.dto.response.ProfileResponseDto;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.function.Function;


@Data
@Builder
public class DiaryListResponseDto {

	private ProfileResponseDto user;
	private String title;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate startDate;
	private Page<DiarySimpleResponseDto> diaryList;


	public static DiaryListResponseDto fromEntity(DiarySetEntity diarySet, Page<DiarySimpleResponseDto> diaryList, Function<Long, Boolean> isFollowed) {
		return DiaryListResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(diarySet.getUser(), isFollowed))
			.title(diarySet.getTitle())
			.startDate(diarySet.getStartDate())
			.diaryList(diaryList)
			.build();
	}

}
