package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiarySetEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import static com.chicochico.common.service.FileService.NGINX_PATH;


@Data
@Builder
public class DiarySetResponseDto {

	private Long diarySetId;
	private String imagePath;
	private Integer bookmarkCount;
	private Boolean isBookmarked;
	private Integer diaryCount;
	private String title;


	public static DiarySetResponseDto fromEntity(DiarySetEntity diarySet, Function<DiarySetEntity, Boolean> isBookmarked) {
		String path = diarySet.getImagePath();
		if (!path.startsWith("http")) {
			path = NGINX_PATH + path;
		}
		return DiarySetResponseDto.builder()
			.diarySetId(diarySet.getId())
			.imagePath(path)
			.bookmarkCount(diarySet.getBookmarkCount())
			.isBookmarked(isBookmarked.apply(diarySet))
			.diaryCount(diarySet.getDiaryCount())
			.title(diarySet.getTitle())
			.build();
	}


	public static List<DiarySetResponseDto> fromEnityList(List<DiarySetEntity> diarySetList, Function<DiarySetEntity, Boolean> isBookmarked) {
		List<DiarySetResponseDto> result = new ArrayList<>();
		for (DiarySetEntity diarySet : diarySetList) {
			DiarySetResponseDto diarySetResponseDto = DiarySetResponseDto.fromEntity(diarySet, isBookmarked);
			result.add(diarySetResponseDto);
		}
		return result;
	}


	public static Page<DiarySetResponseDto> fromEntityPage(List<DiarySetEntity> list, Pageable pageable, Function<DiarySetEntity, Boolean> isBookmarked) {
		int start = (int) pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), list.size());
		List<DiarySetResponseDto> dtoList = DiarySetResponseDto.fromEnityList(list, isBookmarked);
		try {
			Page<DiarySetResponseDto> result = new PageImpl<>(dtoList.subList(start, end), pageable, dtoList.size());
			return result;
		} catch (IllegalArgumentException e) {
			return Page.empty();
			//			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}
	}

}
