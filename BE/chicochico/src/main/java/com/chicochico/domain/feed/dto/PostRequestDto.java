package com.chicochico.domain.feed.dto;


import com.chicochico.domain.feed.entity.PostEntity;
import lombok.Data;


/**
 * 포스트 생성, 수정 요청
 */
@Data
public class PostRequestDto {

	public PostEntity toEntity() {
		return (PostEntity) new Object();
	}

}
