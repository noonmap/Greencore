package com.chicochico.domain.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.common.service.FileService;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.user.dto.request.ProfileRequestDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProfileService {

	static private final String IMAGE_FILE_SUB_DIR = "profile";
	static private final String DEFAULT_PROFILE_IMAGE_PATH = "default_profileImagePath";
	private final UserRepository userRepository;

	private final UserPlantRepository userPlantRepository;

	private final AuthService authService;

	private final FileService fileService;


	/**
	 * 프로필을 조회합니다.
	 *
	 * @param nickname 조회할 유저 닉네임
	 * @return 조회된 유저 프로필
	 */
	public UserEntity getUserProfile(String nickname) {
		return userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}


	/**
	 * 프로필을 수정합니다.
	 *
	 * @param profileRequestDto 프로필 수정 내용
	 */
	public void modifyUserProfile(ProfileRequestDto profileRequestDto) {
		// 로그인한 유저의 프로필 가져오기
		String userNickname = authService.getUserNickname();
		UserEntity user = getUserProfile(userNickname);

		// 새로운 nickname이 이미 존재하는 닉네임인지 (unique) 확인
		if (userRepository.findByNickname(profileRequestDto.getNickname()).isPresent()) {
			throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
		}

		// 로그인한 유저 정보 수정 (nickname, introduction 수정)
		userRepository.save(profileRequestDto.toEntity(user));

	}


	/**
	 * 프로필 이미지를 수정합니다.
	 *
	 * @param profileImage 프로필 이미지
	 */
	public void modifyUserProfileImage(MultipartFile profileImage) {
		// 로그인한 유저의 프로필 가져오기
		String userNickname = authService.getUserNickname();
		UserEntity user = getUserProfile(userNickname);

		// 기존 연결된 프로필 이미지 삭제 (default 이미지인지 확인하는 로직 필요)
		String originImagePath = user.getProfileImagePath();
		if (!originImagePath.equals(DEFAULT_PROFILE_IMAGE_PATH)) // TODO 실제 프로필 default 경로 넣기
			fileService.deleteImageFile(originImagePath);

		// 새 프로필 이미지 저장
		String savedPath = fileService.storeImageFile(profileImage, IMAGE_FILE_SUB_DIR);

		// 수정 내용 저장
		user.setProfileImagePath(savedPath);
		userRepository.save(user);

	}


	/**
	 * 사용자를 검색합니다.
	 *
	 * @param search   검색할 사용자 닉네임
	 * @param pageable 페이지네이션
	 * @return 사용자 조회 페이지
	 */
	public Page<UserEntity> getUserProfileList(String search, Pageable pageable) {
		return userRepository.findAllByNicknameContainingIgnoreCase(search, pageable);
	}


	/**
	 * 나와 같은 식물을 키우는 사람들 조회합니다.
	 *
	 * @return 나와 같은 식물을 키우는 사람들 리스트
	 */
	public List<UserEntity> getSamePlantUserProfileList() {
		Long userId = authService.getUserId();

		// 로그인한 유저의 userPlantList 가져오기
		List<UserPlantEntity> userPlantList = userPlantRepository.findByUserIdAndIsDeleted(userId, IsDeletedType.N);
		// 로그인한 유저의 plantId Set 생성 (내가 키우는 식물 종류 (distinct))
		Set<Long> distinctPlantIds = userPlantList.stream()
			.map(UserPlantEntity::getPlant)
			.map(PlantEntity::getId)
			.collect(Collectors.toSet());

		// 나와 같은 식물을 키우는 사람들 최대 3개 랜덤으로 가져오기 (최대 3개로 한정)
		// 삭제된 유저나 본인 제외한 유저 리스트 반환
		PageRequest pageRequest = PageRequest.of(0, 3);
		return userPlantRepository.findDistinctUsersByPlantIdsRandom(distinctPlantIds, userId, pageRequest);
	}

}
