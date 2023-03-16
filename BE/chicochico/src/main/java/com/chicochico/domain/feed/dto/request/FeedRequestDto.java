package com.chicochico.domain.feed.dto.request;


import com.chicochico.domain.feed.entity.FeedEntity;
import lombok.Data;


/**
 * 피드 목록 조회 요청
 */
@Data
public class FeedRequestDto {

	public FeedEntity toEntity() {
		return (FeedEntity) new Object();
	}

}
