package com.chicochico.domain.feed.dto.response;


import com.chicochico.common.code.FeedType;
import com.chicochico.domain.feed.entity.FeedEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

import static com.chicochico.common.service.FileService.NGINX_PATH;


@Data
@Builder
public class FeedSimpleResponseDto {

	private Long feedId;

	private FeedType feedType;

	private String imagePath;

	private String content;


	public static FeedSimpleResponseDto fromEntity(FeedEntity xx) {
		FeedType feedType;

		if (xx.getFeedCode().equals(FeedType.FEED_DIARY.name())) {
			feedType = FeedType.FEED_DIARY;
		} else {
			feedType = FeedType.FEED_POST;
		}
		String path = xx.getImagePath();
		if (!path.startsWith("http")) {
			path = NGINX_PATH + path;
		}
		return FeedSimpleResponseDto.builder()
			.feedId(xx.getId())
			.feedType(feedType)
			.imagePath(path)
			.content(xx.getContent().substring(0, Math.min(xx.getContent().length(), 50))) // 최대 50자까지 잘라서 전송
			.build();
	}


	public static List<FeedSimpleResponseDto> fromEnityList(List<FeedEntity> xxList) {
		List<FeedSimpleResponseDto> result = new ArrayList<>();
		for (FeedEntity xx : xxList) {
			FeedSimpleResponseDto xxResponseDto = FeedSimpleResponseDto.fromEntity(xx);
			result.add(xxResponseDto);
		}
		return result;
	}


	public static Page<FeedSimpleResponseDto> fromEnityPage(Page<FeedEntity> page) {
		Page<FeedSimpleResponseDto> result = page.map(FeedSimpleResponseDto::fromEntity);
		return result;

	}

}
