package com.chicochico.domain.feed.service;


import com.chicochico.domain.feed.dto.DiaryRequestDto;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DiaryService {

	private final DiaryRepository diaryRepository;


	/**
	 * 일지를 생성합니다.
	 *
	 * @param diarySetId
	 * @param diaryRequestDto
	 */
	public void createDiary(Long diarySetId, DiaryRequestDto diaryRequestDto) {
	}


	/**
	 * 해당 관찰일지의 일지 목록을 조회합니다.
	 *
	 * @param diarySetId
	 * @return
	 */
	public List<DiaryEntity> getDiaryList(Long diarySetId) {
		return new ArrayList<>();
	}


	/**
	 * 해당 일지를 상세 조회합니다.
	 *
	 * @param diaryId
	 * @return
	 */
	public DiaryEntity getDiary(Long diaryId) {
		return new DiaryEntity();
	}


	/**
	 * 해당 일지를 수정합니다.
	 *
	 * @param diaryId
	 * @param diaryRequestDto
	 */
	public void modifyDiary(Long diaryId, DiaryRequestDto diaryRequestDto) {
	}


	/**
	 * 해당 일지를 삭제합니다.
	 *
	 * @param diaryId
	 */
	public void deleteDiary(Long diaryId) {
	}

}
