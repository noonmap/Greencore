package com.chicochico.domain.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.IsEnabledType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.repository.DiarySetRepository;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.user.dto.request.PasswordRequestDto;
import com.chicochico.domain.user.dto.request.RegisterRequestDto;
import com.chicochico.domain.user.dto.request.UserPlantRequestDto;
import com.chicochico.domain.user.dto.request.UserPlantSimpleRequestDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;


@Log4j2
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PlantRepository plantRepository;
	private final UserPlantRepository userPlantRepository;
	private final DiarySetRepository diarySetRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthService authService;


	public UserEntity getUserByNickname(String nickname) {
		return userRepository.findByNicknameAndIsDeleted(nickname, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}


	/**
	 * 회원을 생성합니다 (회원가입)
	 *
	 * @param registerRequestDto 생성된 회원정보
	 */
	@Transactional
	public void createUser(RegisterRequestDto registerRequestDto) {
		// 이미 존재하는 이메일인지 다시 한번 확인
		if (userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()) {
			throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
		}

		// 이미 존재하는 닉네임인지 다시 한번 확인
		if (userRepository.findByNickname(registerRequestDto.getNickname()).isPresent()) {
			throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
		}

		registerRequestDto.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
		userRepository.save(registerRequestDto.toEntity());
	}


	/**
	 * 닉네임 중복을 확인합니다
	 *
	 * @param nickname 유저 닉네임
	 * @return TRUE: 닉네임 중복 아님, FALSE: 닉네임 중복
	 */
	public Boolean checkNickname(String nickname) {
		return userRepository.findByNickname(nickname).isEmpty();
	}


	/**
	 * 이메일 중복을 확인합니다.
	 *
	 * @param email 이메일
	 * @return TRUE 이메일 중복 아님, FALSE: 이메일 중복
	 */
	public Boolean checkEmail(String email) {
		return userRepository.findByEmail(email).isEmpty();
	}


	/**
	 * 현재 비밀번호를 확인합니다 (회원정보 조회)
	 *
	 * @param passwordRequestDto 비밀번호 (password)
	 * @return TRUE: 비밀번호 일치, FALSE: 비밀번호 불일치
	 */
	public Boolean checkPassword(PasswordRequestDto passwordRequestDto) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		return passwordEncoder.matches(passwordRequestDto.getPassword(), user.getPassword());
	}


	/**
	 * 비밀번호를 수정합니다 (회원정보 수정)
	 *
	 * @param passwordRequestDto 새 비밀번호 (newPassword)
	 */
	@Transactional
	public void modifyPassword(PasswordRequestDto passwordRequestDto) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		String password = user.getPassword();

		// 현재 비밀번호와 이전 비밀번호가 일치
		if (passwordEncoder.matches(passwordRequestDto.getPassword(), password)) {
			throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
		}

		user.setPassword(passwordEncoder.encode(passwordRequestDto.getPassword()));
		userRepository.save(user);
	}


	/**
	 * 회원정보를 삭제합니다 (회원탈퇴)
	 */
	@Transactional
	public void deleteUser() {

		Long userId = authService.getUserId();
		Optional<UserEntity> selectedUser = userRepository.findById(userId);
		if (selectedUser.isEmpty()) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		UserEntity user = selectedUser.get();
		user.setIsDeleted(IsDeletedType.Y);
		userRepository.save(user);
	}


	/**
	 * 유저가 키우는 식물을 조회합니다.
	 *
	 * @param nickname    유저 닉네임
	 * @param userPlantId 유저 식물 id
	 * @return 유저가 키우는 식물
	 */
	public UserPlantEntity getUserPlant(String nickname, Long userPlantId) {

		getUserByNickname(nickname);
		UserPlantEntity userPlant = userPlantRepository.findByIdAndIsDeleted(userPlantId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		return userPlant;
	}


	/**
	 * 유저가 키우는 식물 목록을 조회합니다.
	 *
	 * @param nickname 유저 닉네임
	 * @return 유저가 키우는 식물 목록
	 */
	public List<UserPlantEntity> getUserPlantList(String nickname) {
		UserEntity user = getUserByNickname(nickname);
		List<UserPlantEntity> userPlantList = userPlantRepository.findByUserAndIsDeleted(user, IsDeletedType.N);

		return userPlantList;
	}


	/**
	 * 내가 키우는 식물 생성합니다.
	 *
	 * @param userPlantRequestDto 생성할 유저 식물 정보
	 */
	@Transactional
	public void createUserPlant(UserPlantRequestDto userPlantRequestDto) {

		// 로그인 유저
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		PlantEntity plant = plantRepository.findById(userPlantRequestDto.getPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		UserPlantEntity userPlant = UserPlantEntity.builder()
			.user(user)
			.plant(plant)
			.plantNickname(userPlantRequestDto.getPlantNickname())
			.plantImagePath(plant.getImagePath())
			.isDeleted(IsDeletedType.N)
			.build();

		userPlantRepository.save(userPlant);

	}


	/**
	 * 내가 키우는 식물 닉네임을 수정합니다.
	 *
	 * @param userPlantId               수정할 유저 식물 id
	 * @param userPlantSimpleRequestDto 수정 내용 (plantNickname)
	 */
	@Transactional
	public void modifyUserPlant(Long userPlantId, UserPlantSimpleRequestDto userPlantSimpleRequestDto) {
		Long userId = authService.getUserId();
		// 수정할 userPlant 가져오기
		UserPlantEntity userPlant = userPlantRepository.findByIdAndIsDeleted(userPlantId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		// 로그인 유저와 userPlant 의 주인이 동일한지 확인
		if (!userPlant.getUser().getId().equals(userId)) {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

		// plantNickname 수정
		userPlant.setPlantNickname(userPlant.getPlantNickname());
		userPlantRepository.save(userPlant);
	}


	/**
	 * 내가 키우는 식물을 삭제합니다.
	 *
	 * @param userPlantId 삭제할 유저 식물 id
	 */
	@Transactional
	public void deleteUserPlant(Long userPlantId) {
		Long userId = authService.getUserId();
		// 수정할 userPlant 가져오기
		UserPlantEntity userPlant = userPlantRepository.findByIdAndIsDeleted(userPlantId, IsDeletedType.N).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		// 로그인 유저와 userPlant 의 주인이 동일한지 확인
		if (!userPlant.getUser().getId().equals(userId)) {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

		userPlant.setIsDeleted(IsDeletedType.Y);
		userPlantRepository.save(userPlant);

		// 연결된 관찰일지가 있는지 확인
		Optional<DiarySetEntity> diarySet = diarySetRepository.findByUserAndUserPlant(userPlant.getUser(), userPlant);

		// 관찰일지가 있다면
		if (diarySet.isPresent()) {
			// 관찰일지 추가 안되도록 DiarySetEntity.isEnabledAddDiary == N
			diarySet.get().setIsEnabledAddDiary(IsEnabledType.N);
			diarySetRepository.save(diarySet.get());
		}

	}

}
