package com.chicochico.domain.feed.service;


import com.chicochico.common.code.FeedbackType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.IsEnabledType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.FileService;
import com.chicochico.common.service.RecommenderService;
import com.chicochico.domain.feed.dto.request.DiaryRequestDto;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.repository.DiaryRepository;
import com.chicochico.domain.feed.repository.DiarySetRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DiaryService {

	private final DiaryRepository diaryRepository;
	private final DiarySetRepository diarySetRepository;
	private final UserRepository userRepository;
	private final AuthService authService;
	private final FileService fileService;
	private final FeedService feedService;
	private final RecommenderService recommenderService;


	/**
	 * 일지를 생성합니다.
	 *
	 * @param diarySetId
	 * @param diaryRequestDto
	 */
	@Transactional
	public void createDiary(Long diarySetId, DiaryRequestDto diaryRequestDto) {
		// 관찰 일지 조회
		DiarySetEntity diarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));
		// 관찰 일지에 일지를 추가할 수 있는지 확인
		if (diarySet.getIsEnabledAddDiary().equals(IsEnabledType.N)) throw new CustomException(ErrorCode.DIARY_SET_ADDITION_PROHIBITED);
		// 유저 조회
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findByIdAndIsDeleted(userId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		// 이미지 저장
		MultipartFile image = diaryRequestDto.getImage();
		String savedPath = fileService.storeImageFile(image, FeedService.IMAGE_FILE_SUB_DIR);

		// DiaryEntity 저장
		DiaryEntity diary = DiaryEntity.builder()
			.user(user)
			.content(diaryRequestDto.getContent())
			.imagePath(savedPath)
			.likeCount(0)
			.isDeleted(IsDeletedType.N)
			.commentCount(0)
			.diarySet(diarySet)
			.observationDate(diaryRequestDto.getObservationDate())
			.build();
		diary = diaryRepository.save(diary);

		// DiarySetEntity의 list에 add & count++
		diarySet.increaseDiaryCount();
		diarySetRepository.save(diarySet);

		// tags들 저장 & 연결
		List<String> tags = diaryRequestDto.getTags();
		feedService.createAndConnectTags(tags, diary);

		// Recommender System에 추가
		recommenderService.insertItem(diary.getId(), false, tags, null, diary.getCreatedAt(), diary.getContent().substring(0, Math.min(30, diary.getContent().length())));
	}


	/**
	 * 해당 관찰일지의 일지 목록을 조회합니다.
	 *
	 * @param diarySetId
	 * @return
	 */
	public List<DiaryEntity> getDiaryList(Long diarySetId) {
		// 관찰 일지 조회
		//		DiarySetEntity diarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));
		List<DiaryEntity> list = diaryRepository.findByDiarySetIdAndIsDeletedOrderByCreatedAtDesc(diarySetId, IsDeletedType.N);//diarySet.getDiaryList();
		// OneToMany 해놓으면 알아서 list에 추가해 주는 듯 -> delete된 거 빼야 한다
		//		list.removeIf(diary -> diary.getIsDeleted().equals(IsDeletedType.Y));
		return list;
	}


	/**
	 * 해당 일지를 상세 조회합니다.
	 *
	 * @param diaryId
	 * @return
	 */
	public DiaryEntity getDiary(Long diaryId) {
		// 일지 조회
		DiaryEntity diary = diaryRepository.findByIdAndIsDeleted(diaryId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_NOT_FOUND));

		// Recommender System에 read Feedback 추가
		Long userId = authService.getUserId();
		recommenderService.insertFeedback(FeedbackType.read, userId, diaryId, LocalDateTime.now());

		return diary;
	}


	/**
	 * 해당 일지를 수정합니다.
	 *
	 * @param diaryId
	 * @param diaryRequestDto
	 */
	@Transactional
	public void modifyDiary(Long diaryId, DiaryRequestDto diaryRequestDto) {
		// 기존 일지 조회
		DiaryEntity originDiary = diaryRepository.findByIdAndIsDeleted(diaryId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_NOT_FOUND));

		// 유저와 작성자 맞는지 확인
		Long userId = authService.getUserId();
		UserEntity writer = originDiary.getUser();
		if (writer.getId() != userId) throw new CustomException(ErrorCode.NO_ACCESS);

		// 기존 연결된 이미지 삭제
		String originImagePath = originDiary.getImagePath();
		fileService.deleteImageFile(originImagePath);

		// 기존 연결된 tag 삭제
		feedService.deleteConnectedTags(originDiary);

		// 새 이미지 저장
		MultipartFile multipartFile = diaryRequestDto.getImage();
		String newImagePath = fileService.storeImageFile(multipartFile, FeedService.IMAGE_FILE_SUB_DIR);

		// DiaryEntity 수정
		DiaryEntity newDiary = DiaryEntity.builder()
			.id(originDiary.getId())
			.user(originDiary.getUser())
			.content(diaryRequestDto.getContent())
			.imagePath(newImagePath)
			.likeCount(originDiary.getLikeCount())
			.commentCount(originDiary.getCommentCount())
			.isDeleted(originDiary.getIsDeleted())
			.diarySet(originDiary.getDiarySet())
			.observationDate(originDiary.getObservationDate())
			.createdAt(originDiary.getCreatedAt())
			.updatedAt(originDiary.getUpdatedAt())
			.build();
		newDiary = diaryRepository.save(newDiary);

		// 새 tags들 저장 & 연결
		feedService.createAndConnectTags(diaryRequestDto.getTags(), newDiary);

		// Recommender System에 삭제 후 추가
		recommenderService.deleteItem(newDiary.getId());
		recommenderService.insertItem(newDiary.getId(), false, diaryRequestDto.getTags(), null, newDiary.getCreatedAt(),
			newDiary.getContent().substring(0, Math.min(30, newDiary.getContent().length())));

	}


	/**
	 * 해당 일지를 삭제합니다.
	 *
	 * @param diaryId
	 */
	@Transactional
	public void deleteDiary(Long diaryId) {
		// 관찰 일지 조회
		DiaryEntity diary = diaryRepository.findByIdAndIsDeleted(diaryId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_NOT_FOUND));
		DiarySetEntity diarySet = diary.getDiarySet();

		// 유저와 작성자 맞는지 확인
		Long userId = authService.getUserId();
		UserEntity writer = diary.getUser();
		if (writer.getId() != userId) throw new CustomException(ErrorCode.NO_ACCESS);

		// feed(diary)와 연결된 요소들 일괄 삭제 (이미지, 태그, 댓글, 좋아요)
		feedService.deleteConnectedComponents(diary);

		// DiarySetEntity 의 list에서 삭제 & count--
		diarySet.decreaseDiaryCount();
		diarySetRepository.save(diarySet);

		// Recommender System에 삭제
		recommenderService.deleteItem(diary.getId());

		// DiaryEntity 삭제
		diary.setIsDeleted(IsDeletedType.Y);
		diaryRepository.save(diary);
	}

}
