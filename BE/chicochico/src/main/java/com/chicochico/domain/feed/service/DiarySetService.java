package com.chicochico.domain.feed.service;


import com.chicochico.domain.feed.dto.DiarySetRequestDto;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.repository.DiarySetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DiarySetService {

	private final DiarySetRepository diarySetRepository;


	/**
	 * 관찰 일지 목록을 조회합니다
	 *
	 * @param nickname 관찰일지 작성자 닉네임
	 * @param pageable 페이지네이션
	 * @return
	 */
	public Page<DiarySetEntity> getDiarySetList(String nickname, Pageable pageable) {
		return Page.empty();
	}


	/**
	 * 관찰 일지를 생성합니다
	 *
	 * @param diarySetRequestDto 생성할 관찰일지 내용
	 */
	public void createDiarySet(DiarySetRequestDto diarySetRequestDto) {
	}


	/**
	 * 관찰 일지를 수정합니다
	 *
	 * @param diarySetId         관찰일지 ID
	 * @param diarySetRequestDto 수정할 관찰일지 내용
	 */
	public void modifyDiarySet(Long diarySetId, DiarySetRequestDto diarySetRequestDto) {
	}


	/**
	 * 관찰 일지를 삭제합니다
	 *
	 * @param diarySetId 관찰 일지 ID
	 */
	public void deleteDiarySet(Long diarySetId) {
	}


	/**
	 * 유저가 북마크한 관찰 일지 목록을 조회합니다
	 *
	 * @param diarySetId 관찰 일지 ID
	 * @param pageable   페이지네이션
	 * @return
	 */
	public Page<DiarySetEntity> getDiarySetBookmarkList(Long diarySetId, Pageable pageable) {
		return Page.empty();
	}


	/**
	 * 인기 관찰 일지를 5개 조회합니다
	 *
	 * @return 인기 관찰 일기 5개 리스트
	 */
	public List<DiarySetEntity> getPopularDiarySetList() {
		return new ArrayList<>();
	}


	/**
	 * 관찰 일지를 북마크합니다
	 *
	 * @param diarySetId 관찰 일지 ID
	 */
	public void createBookmark(Long diarySetId) {
	}


	/**
	 * 관찰 일지 북마크를 취소(삭제)합니다
	 *
	 * @param diarySetId 관찰 일지 ID
	 */
	public void deleteBookmark(Long diarySetId) {
	}

}
