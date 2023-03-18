package com.chicochico.domain.feed.dto.request;


import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


/**
 * 포스트 생성, 수정 요청
 */
@Data
@Builder
public class PostRequestDto {

	private String content;
	private MultipartFile image;

	private List<String> tags;
	
}
