package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.FileService;
import com.chicochico.domain.feed.dto.request.DiarySetRequestDto;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.repository.DiarySetRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DiarySetService {

	private final DiarySetRepository diarySetRepository;
	private final UserRepository userRepository;
	private final AuthService authService;
	private final FileService fileService;
	private final UserPlantRepository userPlantRepository;


	/**
	 * 관찰 일지 목록을 조회합니다
	 *
	 * @param nickname 관찰일지 작성자 닉네임
	 * @param pageable 페이지네이션
	 * @return
	 */
	public Page<DiarySetEntity> getDiarySetList(String nickname, Pageable pageable) {
		// 작성자 조회
		UserEntity writer = userRepository.findByNickname(nickname).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		if (writer.getIsDeleted().equals(IsDeletedType.Y)) throw new CustomException(ErrorCode.USER_NOT_FOUND); // 이미 탈퇴한 유저

		// 삭제된 관찰일지를 제외한 것 조회
		Page<DiarySetEntity> diarySetPage = diarySetRepository.findByUserAndIsDeleted(writer, IsDeletedType.N, pageable);
		return diarySetPage;
	}


	/**
	 * 관찰 일지를 생성합니다
	 *
	 * @param diarySetRequestDto 생성할 관찰일지 내용
	 */
	public void createDiarySet(DiarySetRequestDto diarySetRequestDto) {
		// 작성자 조회
		Long userId = authService.getUserId();
		UserEntity writer = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 내키식 조회
		UserPlantEntity userPlant = userPlantRepository.findById(diarySetRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		// 이미지 저장
		MultipartFile image = diarySetRequestDto.getImage();
		String savedPath = fileService.storeImageFile(image, FeedService.IMAGE_FILE_SUB_DIR);

		// DiarySetEntity 저장
		DiarySetEntity diarySet = DiarySetEntity.builder()
			.user(writer)
			.userPlant(userPlant)
			.imagePath(savedPath)
			.diaryCount(0)
			.title(diarySetRequestDto.getTitle())
			.isDeleted(IsDeletedType.N)
			.build();
		diarySetRepository.save(diarySet);
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
