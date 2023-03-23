package com.chicochico.domain.feed.dto.request;


import com.chicochico.domain.feed.entity.DiaryEntity;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;


/**
 * 일지 생성, 수정 요청
 * content: String
 * tags:List<String>,
 * observationDate: LocalDate,
 * image: multipart File
 */
@Data
@Builder
public class DiaryRequestDto {

	private String content;
	private List<String> tags;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate observationDate;
	private MultipartFile image;


	public DiaryEntity toEntity() {
		return (DiaryEntity) new Object();
	}

}
