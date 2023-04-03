package com.chicochico.domain.feed.service;


import com.chicochico.common.code.FeedbackType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.FileService;
import com.chicochico.common.service.RecommenderService;
import com.chicochico.domain.feed.dto.request.DiarySetRequestDto;
import com.chicochico.domain.feed.entity.BookmarkEntity;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.repository.BookmarkRepository;
import com.chicochico.domain.feed.repository.DiaryRepository;
import com.chicochico.domain.feed.repository.DiarySetRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import io.gorse.gorse4j.Feedback;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class DiarySetService {

	private final DiarySetRepository diarySetRepository;
	private final DiaryRepository diaryRepository;
	private final BookmarkRepository bookmarkRepository;
	private final UserRepository userRepository;
	private final AuthService authService;
	private final FileService fileService;
	private final UserPlantRepository userPlantRepository;
	private final RecommenderService recommenderService;


	public DiarySetEntity getDiarySet(Long diarySetId) {
		return diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));
	}


	/**
	 * 관찰 일지 목록을 조회합니다
	 *
	 * @param nickname 관찰일지 작성자 닉네임
	 * @return
	 */
	public List<DiarySetEntity> getDiarySetList(String nickname, Pageable pageable) {
		// 작성자 조회
		UserEntity writer = userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 삭제된 관찰일지를 제외한 것 조회
		List<DiarySetEntity> diarySetPage = diarySetRepository.findByUserAndIsDeleted(writer, IsDeletedType.N);
		return diarySetPage;
	}


	/**
	 * 관찰 일지를 생성합니다
	 *
	 * @param diarySetRequestDto 생성할 관찰일지 내용
	 */
	@Transactional
	public void createDiarySet(DiarySetRequestDto diarySetRequestDto) {
		// 작성자 조회
		System.out.println(diarySetRequestDto);
		Long userId = authService.getUserId();
		UserEntity writer = userRepository.findByIdAndIsDeleted(userId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

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
			.startDate(diarySetRequestDto.getStartDate())
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
	@Transactional
	public void modifyDiarySet(Long diarySetId, DiarySetRequestDto diarySetRequestDto) {
		System.out.println("diarySetId = " + diarySetId + ", diarySetRequestDto = " + diarySetRequestDto);
		// 삭제된 관찰일지인지 확인
		DiarySetEntity originDiarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));

		// 작성자와 현재 유저 같은 사람인지 확인
		Long userId = authService.getUserId();
		UserEntity writer = originDiarySet.getUser();
		if (writer.getId() != userId) throw new CustomException(ErrorCode.NO_ACCESS);

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
			.startDate(diarySetRequestDto.getStartDate())
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
	@Transactional
	public void deleteDiarySet(Long diarySetId) {
		// 삭제된 관찰일지인지 확인
		DiarySetEntity diarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));

		// 연결된 일지들을 삭제
		List<DiaryEntity> diaryList = diarySet.getDiaryList();
		for (DiaryEntity diary : diaryList) {
			diary.setIsDeleted(IsDeletedType.Y);
		}
		diaryRepository.saveAll(diaryList);
		diarySet.clearDiaryCount();

		// 이미지 삭제
		String originImagePath = diarySet.getImagePath();
		fileService.deleteImageFile(originImagePath);

		// 연결된 북마크 삭제
		bookmarkRepository.deleteByDiarySet(diarySet);
		diarySet.clearBookmarkCount();

		// 유저의 북마크 리스트들을 삭제
		diarySet.getUser().getBookmarkList().clear();

		// 관찰 일지 삭제
		diarySet.setIsDeleted(IsDeletedType.Y);
		diarySetRepository.save(diarySet);
	}


	/**
	 * 유저가 북마크한 관찰 일지 목록을 조회합니다
	 *
	 * @param nickname 유저 닉네임
	 * @param pageable 페이지네이션
	 * @return
	 */
	public List<DiarySetEntity> getDiarySetBookmarkList(String nickname, Pageable pageable) {
		// 유저 조회
		UserEntity user = userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 북마크 리스트 조회 (삭제된 관찰일지에 대한 북마크는 존재하지 않음 가정)
		List<BookmarkEntity> bookmarkList = bookmarkRepository.findByUser(user);
		List<DiarySetEntity> diarySetList = bookmarkList.stream().map(BookmarkEntity::getDiarySet).collect(Collectors.toList());

		return diarySetList;
	}


	/**
	 * 인기 관찰 일지를 2개 조회합니다
	 *
	 * @return 인기 관찰 일기 2개 리스트
	 */
	public List<DiarySetEntity> getPopularDiarySetList() {
		// 가장 북마크 수가 많은 관찰 일지 구함
		List<DiarySetEntity> diarySetTop2 = diarySetRepository.findTop2ByOrderByBookmarkCountDesc();
		return diarySetTop2;
	}


	/**
	 * 관찰 일지를 북마크합니다
	 *
	 * @param diarySetId 관찰 일지 ID
	 */
	@Transactional
	public void createBookmark(Long diarySetId) {
		// 유저 조회
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findByIdAndIsDeleted(userId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 관찰 일지 조회
		DiarySetEntity diarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));

		// 북마크 이미 있는지 조회
		Optional<BookmarkEntity> bookmarkEntity = bookmarkRepository.findByDiarySetAndUser(diarySet, user);
		if (bookmarkEntity.isPresent()) throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);

		// 없으면 북마크 만든다
		BookmarkEntity newBookmark = BookmarkEntity.builder().user(user).diarySet(diarySet).build();
		BookmarkEntity savedBookmark = bookmarkRepository.save(newBookmark);

		// 유저의 북마크 리스트에 추가한다.
		user.getBookmarkList().add(savedBookmark);

		// 관찰 일지에 북마크 카운트를 추가한다.
		diarySet.increaseBookmarkCount();
		diarySetRepository.save(diarySet);

		// 하위의 모든 일지들에 대해 Recommender System에 positive feedback을 추가
		List<Feedback> feedbacks = diarySet.getDiaryList().stream().map(
			diary -> recommenderService.createFeedback(FeedbackType.bookmark, userId, diary.getId(), LocalDateTime.now())
		).collect(Collectors.toList());
		recommenderService.insertFeedback(feedbacks);
	}


	/**
	 * 관찰 일지 북마크를 취소(삭제)합니다
	 *
	 * @param diarySetId 관찰 일지 ID
	 */
	@Transactional
	public void deleteBookmark(Long diarySetId) {
		// 유저 조회
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findByIdAndIsDeleted(userId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 관찰 일지 조회
		DiarySetEntity diarySet = diarySetRepository.findByIdAndIsDeleted(diarySetId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.DIARY_SET_NOT_FOUND));

		// 북마크 있는지 조회
		Optional<BookmarkEntity> bookmarkEntity = bookmarkRepository.findByDiarySetAndUser(diarySet, user);
		// 있으면 삭제한다
		if (bookmarkEntity.isPresent()) {
			bookmarkRepository.delete(bookmarkEntity.get());

			// 유저의 북마크 리스트에서 삭제
			user.getBookmarkList().remove(bookmarkEntity.get());

			// 관찰 일지에서 북마크 카운드 감소
			diarySet.decreaseBookmarkCount();
			diarySetRepository.save(diarySet);
		}
	}


	public boolean isBookmarked(DiarySetEntity diarySet) {
		UserEntity user = userRepository.findByIdAndIsDeleted(authService.getUserId(), IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		// 북마크 있는지 확인
		Optional<BookmarkEntity> bookmark = bookmarkRepository.findByDiarySetAndUser(diarySet, user);
		if (bookmark.isPresent()) return true;
		return false;
	}


	/**
	 * 유저의 모든 북마크 삭제
	 *
	 * @param userId 북마크를 삭제하려고 하는 유저
	 */
	@Transactional
	public void deleteAllBookmarksByUserId(Long userId) {
		bookmarkRepository.deleteByUserId(userId);
	}

}
