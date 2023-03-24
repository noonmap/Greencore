package com.chicochico.domain.feed.dto.response;


import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.user.dto.response.ProfileResponseDto;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Function;


/**
 * user: {
 * nickname: String,
 * profileImagePath: String,
 * introduction: String,
 * followingCount: Integer,
 * followerCount: Integer,
 * isFollowed: Boolean,
 * }
 * diarySetId: Long
 * observationDate: LocalDate
 * content: String,
 * tags: List<String>
 * imagePath: String
 * likeCount: Integer
 * createdAt: LocalDateTime
 */
@Data
@Builder
public class DiaryResponseDto {

	private ProfileResponseDto user;
	private Long diarySetId;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate observationDate;
	private String content;
	private List<String> tags;
	private String imagePath;
	private Integer likeCount;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	private LocalDateTime createdAt;


	public static DiaryResponseDto fromEntity(DiaryEntity diary, Function<Long, List<String>> getTagsList, Function<Long, Boolean> isFollowed) {
		return DiaryResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(diary.getUser(), isFollowed))
			.diarySetId(diary.getDiarySet().getId())
			.observationDate(diary.getObservationDate())
			.content(diary.getContent())
			.tags(getTagsList.apply(diary.getId()))
			.imagePath(diary.getImagePath())
			.likeCount(diary.getLikeCount())
			.createdAt(diary.getCreatedAt())
			.build();
	}

}
