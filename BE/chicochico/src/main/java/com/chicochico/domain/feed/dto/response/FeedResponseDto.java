package com.chicochico.domain.feed.dto.response;


import com.chicochico.common.code.FeedType;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.user.dto.response.ProfileResponseDto;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import static com.chicochico.common.service.FileService.NGINX_PATH;


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
	private Long growingDay;


	public static FeedResponseDto fromEntity(FeedEntity xx, Boolean isLiked, Integer commentCount, Function<Long, Boolean> isFollowed) {
		FeedType feedType;
		LocalDate observationDate;
		String diarySetTitle;
		Long growingDay;
		DiaryEntity diary = null;
		if (xx instanceof DiaryEntity) {
			diary = (DiaryEntity) xx;
			feedType = FeedType.FEED_DIARY;
			observationDate = diary.getObservationDate();
			diarySetTitle = diary.getDiarySet().getTitle();
			growingDay = ChronoUnit.DAYS.between(diary.getDiarySet().getStartDate(), diary.getObservationDate());
		} else {
			feedType = FeedType.FEED_POST;
			observationDate = null;
			diarySetTitle = null;
			growingDay = null;
		}

		String path = xx.getImagePath();
		if (!path.startsWith("http")) {
			path = NGINX_PATH + path;
		}
		return FeedResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(xx.getUser(), isFollowed))
			.feedCode(feedType)
			.observationDate(observationDate)
			.feedId(xx.getId())
			.content(xx.getContent()) // 최대 50자까지 잘라서 전송
			.imagePath(path)
			.likeCount(xx.getLikeCount())
			.isLiked(isLiked)
			.commentCount(commentCount)
			.diarySetTitle(diarySetTitle)
			.growingDay(growingDay)
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


	public static Page<FeedResponseDto> fromEnityPage(List<FeedEntity> feedList, Function<Long, Boolean> isLiked, Function<Long, Integer> getCommentCount, Function<Long, Boolean> isFollowed,
		Pageable pageable) {
		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), feedList.size());
		List<FeedResponseDto> feedResponseDtoList = fromEnityList(feedList, isLiked, getCommentCount, isFollowed);

		try {
			Page<FeedResponseDto> result = new PageImpl<>(feedResponseDtoList.subList(start, end), pageable, feedResponseDtoList.size());
			return result;
		} catch (IllegalArgumentException e) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

	}

}
