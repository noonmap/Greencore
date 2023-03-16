package com.chicochico.domain.user.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.dto.ResultDto;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.user.dto.request.PasswordRequestDto;
import com.chicochico.domain.user.dto.request.RegisterRequestDto;
import com.chicochico.domain.user.dto.request.UserPlantRequestDto;
import com.chicochico.domain.user.dto.request.UserPlantSimpleRequestDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Log4j2
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthService authService;


	/**
	 * 회원을 생성합니다 (회원가입)
	 *
	 * @param registerRequestDto 생성된 회원정보
	 */
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
	 * @return ResultDto.ofSuccess(): 닉네임 중복 아님, ResultDto.ofFail(): 닉네임 중복
	 */
	public ResultDto<Boolean> checkNickname(String nickname) {
		if (userRepository.findByNickname(nickname).isPresent()) {
			return ResultDto.ofFail();
		}
		return ResultDto.ofSuccess();
	}


	/**
	 * 이메일 중복을 확인합니다.
	 *
	 * @param email 이메일
	 * @return ResultDto.ofSuccess(): 이메일 중복 아님, ResultDto.ofFail(): 이메일 중복
	 */
	public ResultDto<Boolean> checkEmail(String email) {
		if (userRepository.findByEmail(email).isPresent()) {
			return ResultDto.ofFail();
		}
		return ResultDto.ofSuccess();
	}


	/**
	 * 현재 비밀번호를 확인합니다 (회원정보 조회)
	 *
	 * @param passwordRequestDto 비밀번호 (password)
	 * @return ResultDto.ofSuccess(): 비밀번호 일치, ResultDto.ofFail(): 비밀번호 불일치
	 */
	public ResultDto<Boolean> checkPassword(PasswordRequestDto passwordRequestDto) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserDetails userDetails = (UserDetails) principal;

		String password = userDetails.getPassword();

		if (!passwordEncoder.matches(passwordRequestDto.getPassword(), password)) {
			//			throw new CustomException(PASSWORD_NOT_MATCH);
			return ResultDto.ofFail();
		}

		return ResultDto.ofSuccess();
	}


	/**
	 * 비밀번호를 수정합니다 (회원정보 수정)
	 *
	 * @param passwordRequestDto 새 비밀번호 (newPassword)
	 * @return ResultDto.ofSuccess(): 비밀번호 수정 성공, ResultDto.ofFail(): 비밀번호 수정 실패
	 */
	public ResultDto<Boolean> modifyPassword(PasswordRequestDto passwordRequestDto) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserDetails userDetails = (UserDetails) principal;

		String userId = userDetails.getUsername();
		String password = userDetails.getPassword();

		log.info("[modifyPassword] 변경 후 {}, 현재비번 {}", passwordRequestDto.getPassword(), password);
		if (passwordEncoder.matches(passwordRequestDto.getPassword(), password)) {
			//			throw new CustomException(PASSWORD_NOT_MATCH);
			log.info("[modifyPassword] 변경 전 후 동일 => 실패 ");
			return ResultDto.ofFail();
		}

		Optional<UserEntity> selectedUser = userRepository.findById(Long.parseLong(userId));
		log.info("[modifyPassword] 유저가져오기");

		if (selectedUser.isEmpty()) {
			log.info("[modifyPassword] 빈 유저 => 실패");
			return ResultDto.ofFail();
		}

		UserEntity user = selectedUser.get();
		user.updatePassword(passwordEncoder.encode(passwordRequestDto.getPassword()));
		log.info("[modifyPassword] 유저 정보 변경완료");
		userRepository.save(user);

		return ResultDto.ofSuccess();
	}


	/**
	 * 회원정보를 삭제합니다 (회원탈퇴)
	 */
	public ResultDto<Boolean> deleteUser() {
		
		Long userId = authService.getUserId();
		Optional<UserEntity> selectedUser = userRepository.findById(userId);
		if (selectedUser.isEmpty()) {
			return ResultDto.ofFail();
		}

		UserEntity user = selectedUser.get();
		user.updateIsDeletedType(IsDeletedType.Y);
		userRepository.save(user);
		return ResultDto.ofSuccess();
	}


	/**
	 * @param nickname    유저 닉네임
	 * @param userPlantId 유저 식물 id
	 * @return 유저가 키우는 식물
	 */
	public UserPlantEntity getUserPlant(String nickname, Long userPlantId) {
		return (UserPlantEntity) new Object();
	}


	/**
	 * 유저가 키우는 식물 목록을 조회합니다.
	 *
	 * @param nickname 유저 닉네임
	 * @return 유저가 키우는 식물 목록
	 */
	public List<UserPlantEntity> getUserPlantList(String nickname) {
		return new ArrayList<>();
	}


	/**
	 * 내가 키우는 식물 생성합니다.
	 *
	 * @param userPlantRequestDto 생성할 유저 식물 정보
	 */
	public void createUserPlant(UserPlantRequestDto userPlantRequestDto) {
	}


	/**
	 * 내가 키우는 식물 닉네임을 수정합니다.
	 *
	 * @param userPlantId               수정할 유저 식물 id
	 * @param userPlantSimpleRequestDto 수정 내용 (plantNickname)
	 */
	public void modifyUserPlant(Long userPlantId, UserPlantSimpleRequestDto userPlantSimpleRequestDto) {
	}


	/**
	 * 내가 키우는 식물을 삭제합니다.
	 *
	 * @param userPlantId 삭제할 유저 식물 id
	 */
	public void deleteUserPlant(Long userPlantId) {
	}

}
