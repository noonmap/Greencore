package com.chicochico.domain.feed.dto.request;


import com.chicochico.domain.feed.entity.DiaryEntity;


/**
 * 일지 생성, 수정 요청
 */
public class DiaryRequestDto {

	public DiaryEntity toEntity() {
		return (DiaryEntity) new Object();
	}

}
