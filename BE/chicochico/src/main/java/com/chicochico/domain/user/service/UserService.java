package com.chicochico.domain.user.service;


import com.chicochico.domain.user.dto.PasswordRequestDto;
import com.chicochico.domain.user.dto.RegisterRequestDto;
import com.chicochico.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


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

}
