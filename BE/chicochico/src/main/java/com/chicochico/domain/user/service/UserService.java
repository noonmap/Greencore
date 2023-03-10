package com.chicochico.domain.user.service;


import com.chicochico.domain.user.dto.PasswordRequestDto;
import com.chicochico.domain.user.dto.RegisterRequestDto;
import com.chicochico.domain.user.dto.UserPlantRequestDto;
import com.chicochico.domain.user.dto.UserPlantSimpleRequestDto;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;


	/**
	 * 회원을 생성합니다 (회원가입)
	 *
	 * @param registerRequestDto 생성된 회원정보
	 */
	public void createUser(RegisterRequestDto registerRequestDto) {
	}


	/**
	 * 닉네임 중복을 확인합니다
	 *
	 * @param nickname 유저 닉네임
	 */
	public void checkNickname(String nickname) {
	}


	/**
	 * 비밀번호를 확인합니다 (회원정보 조회)
	 *
	 * @param passwordRequestDto 비밀번호 (password)
	 */
	public void checkPassword(PasswordRequestDto passwordRequestDto) {
	}


	/**
	 * 비밀번호를 수정합니다 (회원정보 수정)
	 *
	 * @param passwordRequestDto 새 비밀번호 (newPassword)
	 */
	public void modifyPassword(PasswordRequestDto passwordRequestDto) {
	}


	/**
	 * 회원정보를 삭제합니다 (회원탈퇴)
	 */
	public void deleteUser() {
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
