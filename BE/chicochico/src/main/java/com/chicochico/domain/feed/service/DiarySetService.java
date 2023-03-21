package com.chicochico.domain.feed.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.FileService;
import com.chicochico.domain.feed.dto.request.DiarySetRequestDto;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.repository.DiaryRepository;
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
	private final DiaryRepository diaryRepository;
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
		// 삭제된 관찰일지인지 확인
		DiarySetEntity originDiarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));

		// 작성자와 현재 유저 같은 사람인지 확인
		Long userId = authService.getUserId();
		UserEntity writer = originDiarySet.getUser();
		if (writer.getId() != userId) throw new CustomException(ErrorCode.NO_ACCESS)

		// 기존 저장된 이미지 삭제 (일지는 건들지 않음)
		String originImagePath = originDiarySet.getImagePath();
		fileService.deleteImageFile(originImagePath);

		// 새로운 이미지 저장
		MultipartFile multipartFile = diarySetRequestDto.getImage();
		String newImagePath = fileService.storeImageFile(multipartFile, FeedService.IMAGE_FILE_SUB_DIR);

		// (내키식은 수정할 수 없다)

		// DiarySetEntity 수정한 내용 저장
		DiarySetEntity newDiarySet = DiarySetEntity.builder()
			.id(originDiarySet.getId())
			.user(originDiarySet.getUser())
			.userPlant(originDiarySet.getUserPlant())
			.imagePath(newImagePath)
			.diaryCount(originDiarySet.getDiaryCount())
			.title(diarySetRequestDto.getTitle())
			.isDeleted(originDiarySet.getIsDeleted())
			.build();
		diarySetRepository.save(newDiarySet);
	}


	/**
	 * 관찰 일지를 삭제합니다
	 *
	 * @param diarySetId 관찰 일지 ID
	 */
	public void deleteDiarySet(Long diarySetId) {
		// 삭제된 관찰일지인지 확인
		DiarySetEntity originDiarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));

		// 연결된 일지들을 삭제
		List<DiaryEntity> diaryList = diaryRepository.findByDiarySetAndIsDeleted(originDiarySet, IsDeletedType.N);
		for (DiaryEntity diary : diaryList) {
		}
		// 이미지 삭제
		String originImagePath = originDiarySet.getImagePath();
		fileService.deleteImageFile(originImagePath);

		// 연결된 북마크 삭제
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
