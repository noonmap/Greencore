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


	public static FeedResponseDto fromEntity(FeedEntity xx, Boolean isLiked, Integer commentCount) {
		FeedType feedType;
		LocalDate observationDate;
		if (xx instanceof DiaryEntity) {
			DiaryEntity diary = (DiaryEntity) xx;
			feedType = FeedType.FEED_DIARY;
			observationDate = diary.getObservationDate();
		} else {
			feedType = FeedType.FEED_POST;
			observationDate = null;
		}

		return FeedResponseDto.builder()
			.user(ProfileResponseDto.fromEntity(xx.getUser()))
			.feedCode(feedType)
			.observationDate(observationDate)
			.feedId(xx.getId())
			.content(xx.getContent())
			.imagePath(xx.getImagePath())
			.likeCount(xx.getLikeCount())
			.isLiked(isLiked)
			.commentCount(commentCount)
			.createdAt(xx.getCreatedAt())
			.build();
	}


	// isLiked, commentCount 때문에 Controller에서 처리
	public static List<FeedResponseDto> fromEnityList(List<FeedEntity> xxList, Function<Long, Boolean> isLiked, Function<Long, Integer> getCommentCount) {
		List<FeedResponseDto> result = new ArrayList<>();
		for (FeedEntity xx : xxList) {
			FeedResponseDto xxResponseDto = FeedResponseDto.fromEntity(xx, isLiked.apply(xx.getId()), getCommentCount.apply(xx.getId()));
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<FeedResponseDto> fromEnityPage(Page<FeedEntity> page, Function<Long, Boolean> isLiked, Function<Long, Integer> getCommentCount) {
		List<FeedEntity> feedList = new ArrayList<>(page.toList());
		List<FeedResponseDto> feedResponseDtoList = fromEnityList(feedList, isLiked, getCommentCount);
		Page<FeedResponseDto> result = new PageImpl<>(feedResponseDtoList, page.getPageable(), feedResponseDtoList.size());
		return result;
	}

}
