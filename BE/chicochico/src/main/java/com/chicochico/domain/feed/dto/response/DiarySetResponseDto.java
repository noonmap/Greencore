package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;


@Data
@Builder
public class DiarySetResponseDto {

	private Long diarySetId;
	private String imagePath;
	private Integer bookmarkCount;
	private Boolean isBookmarked;
	private Integer diaryCount;
	private String title;


	public static DiarySetResponseDto fromEntity(DiarySetEntity diarySet, UserEntity user, BiFunction<UserEntity, DiarySetEntity, Boolean> isBookmarked) {
		return DiarySetResponseDto.builder()
			.diarySetId(diarySet.getId())
			.imagePath(diarySet.getImagePath())
			.bookmarkCount(diarySet.getBookmarkCount())
			.isBookmarked(isBookmarked.apply(user, diarySet))
			.diaryCount(diarySet.getDiaryCount())
			.title(diarySet.getTitle())
			.build();
	}


	public static List<DiarySetResponseDto> fromEnityList(List<DiarySetEntity> diarySetList, UserEntity user, BiFunction<UserEntity, DiarySetEntity, Boolean> isBookmarked) {
		List<DiarySetResponseDto> result = new ArrayList<>();
		for (DiarySetEntity diarySet : diarySetList) {
			DiarySetResponseDto diarySetResponseDto = DiarySetResponseDto.fromEntity(diarySet, user, isBookmarked);
			result.add(diarySetResponseDto);
		}
		return result;
	}


	public static Page<DiarySetResponseDto> fromEntityPage(List<DiarySetEntity> list, Pageable pageable, UserEntity user, BiFunction<UserEntity, DiarySetEntity, Boolean> isBookmarked) {
		int start = (int) pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), list.size());
		List<DiarySetResponseDto> dtoList = DiarySetResponseDto.fromEnityList(list, user, isBookmarked);
		Page<DiarySetResponseDto> result = new PageImpl<>(dtoList.subList(start, end), pageable, dtoList.size());
		return result;
	}

}
