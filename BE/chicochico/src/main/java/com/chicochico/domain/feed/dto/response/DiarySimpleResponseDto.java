package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;


/**
 * diaryId: Long
 * content: String,
 * tags: List<String>,
 * observationDate: LocalDate
 * createdAt: LocalDateTime
 * imagePath: String
 * commentCount: Integer
 */
@Data
@Builder
public class DiarySimpleResponseDto {

	private Long diaryId;
	private String content;
	private List<String> tags;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate observationDate;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	private LocalDateTime craetedAt;
	private String imagePath;
	private Integer likeCount;
	private Integer commentCount;
	private Long growingDay;


	public static DiarySimpleResponseDto fromEntity(DiaryEntity diary, Function<Long, List<String>> getTagsList) {
		Long growingDay = ChronoUnit.DAYS.between(diary.getDiarySet().getStartDate(), diary.getObservationDate());
		return DiarySimpleResponseDto.builder()
			.diaryId(diary.getId())
			.content(diary.getContent())
			.tags(getTagsList.apply(diary.getId()))
			.observationDate(diary.getObservationDate())
			.craetedAt(diary.getCreatedAt())
			.imagePath(diary.getImagePath())
			.likeCount(diary.getLikeCount())
			.commentCount(diary.getCommentCount())
			.growingDay(growingDay)
			.build();
	}


	public static List<DiarySimpleResponseDto> fromEnityList(List<DiaryEntity> diaryList, Function<Long, List<String>> getTagsList) {
		List<DiarySimpleResponseDto> result = new ArrayList<>();
		for (DiaryEntity diary : diaryList) {
			DiarySimpleResponseDto diarySimpleResponseDto = DiarySimpleResponseDto.fromEntity(diary, getTagsList);
			result.add(diarySimpleResponseDto);
		}
		return result;
	}


	public static Page<DiarySimpleResponseDto> fromEnityPage(List<DiaryEntity> entityList, Function<Long, List<String>> getTagsList, Pageable pageable) {
		int start = (int) pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), entityList.size());
		List<DiarySimpleResponseDto> dtoList = DiarySimpleResponseDto.fromEnityList(entityList, getTagsList);

		try {
			Page<DiarySimpleResponseDto> result = new PageImpl<>(dtoList.subList(start, end), pageable, dtoList.size());
			return result;
		} catch (IllegalArgumentException e) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}
	}

}
