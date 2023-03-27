package com.chicochico.domain.feed.dto.response;


import com.chicochico.common.code.FeedType;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.user.dto.response.ProfileResponseDto;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;


@Data
@SuperBuilder
public class FeedResponseDto implements Serializable {

	private ProfileResponseDto user;

	private FeedType feedCode;

	private LocalDate observationDate;
	private Long feedId;
	private String content;
	private String imagePath;
	private Integer likeCount;
	private Boolean isLiked;
	private Integer commentCount;
	private LocalDateTime createdAt;
	// FEED_DIARY인 경우, diarySet 관련 추가
	private String diarySetTitle;
	private LocalDate diarySetStartDate;


	public static FeedResponseDto fromEntity(FeedEntity xx, Boolean isLiked, Integer commentCount, Function<Long, Boolean> isFollowed) {
		FeedType feedType;
		LocalDate observationDate;
		String diarySetTitle;
		LocalDate diarySetStartDate;
		DiaryEntity diary = null;
		if (xx instanceof DiaryEntity) {
			diary = (DiaryEntity) xx;
			feedType = FeedType.FEED_DIARY;
			observationDate = diary.getObservationDate();
			diarySetTitle = diary.getDiarySet().getTitle();
			diarySetStartDate = diary.getDiarySet().getStartDate();
		} else {
			feedType = FeedType.FEED_POST;
			observationDate = null;
			diarySetTitle = null;
			diarySetStartDate = null;
		}

		return FeedResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(xx.getUser(), isFollowed))
			.feedCode(feedType)
			.observationDate(observationDate)
			.feedId(xx.getId())
			.content(xx.getContent().substring(0, Math.min(xx.getContent().length(), 50))) // 최대 50자까지 잘라서 전송
			.imagePath(xx.getImagePath())
			.likeCount(xx.getLikeCount())
			.isLiked(isLiked)
			.commentCount(commentCount)
			.diarySetTitle(diarySetTitle)
			.diarySetStartDate(diarySetStartDate)
			.createdAt(xx.getCreatedAt())
			.build();
	}


	// isLiked, commentCount 때문에 Controller에서 처리
	public static List<FeedResponseDto> fromEnityList(List<FeedEntity> xxList, Function<Long, Boolean> isLiked, Function<Long, Integer> getCommentCount, Function<Long, Boolean> isFollowed) {
		List<FeedResponseDto> result = new ArrayList<>();
		for (FeedEntity xx : xxList) {
			FeedResponseDto xxResponseDto = FeedResponseDto.fromEntity(xx, isLiked.apply(xx.getId()), getCommentCount.apply(xx.getId()), isFollowed);
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<FeedResponseDto> fromEnityPage(Page<FeedEntity> page, Function<Long, Boolean> isLiked, Function<Long, Integer> getCommentCount, Function<Long, Boolean> isFollowed) {
		List<FeedEntity> feedList = new ArrayList<>(page.toList());
		List<FeedResponseDto> feedResponseDtoList = fromEnityList(feedList, isLiked, getCommentCount, isFollowed);
		Page<FeedResponseDto> result = new PageImpl<>(feedResponseDtoList, page.getPageable(), feedResponseDtoList.size());
		return result;
	}

}
