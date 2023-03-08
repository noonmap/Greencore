package com.chicochico.domain.feed.dto;


import com.chicochico.domain.feed.entity.DiarySetEntity;


/**
 * 관찰 일지 생성 요청
 */
public class DiarySetRequestDto {

	public DiarySetEntity toEntity() {
		return (DiarySetEntity) new Object();
	}

}
