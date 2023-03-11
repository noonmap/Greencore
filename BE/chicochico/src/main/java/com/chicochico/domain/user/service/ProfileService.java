package com.chicochico.domain.user.service;


import com.chicochico.domain.user.dto.ProfileRequestDto;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ProfileService {

	private final UserRepository userRepository;


	/**
	 * 프로필을 조회합니다.
	 *
	 * @param nickname 조회할 유저 닉네임
	 * @return 조회된 유저 프로필
	 */
	public UserEntity getUserProfile(String nickname) {
		return (UserEntity) new Object();
	}


	/**
	 * 프로필을 수정합니다.
	 *
	 * @param profileRequestDto 프로필 수정 내용
	 */
	public void modifyUserProfile(ProfileRequestDto profileRequestDto) {
	}


	/**
	 * 프로필 이미지를 수정합니다.
	 *
	 * @param profileImage 프로필 이미지
	 */
	public void modifyUserProfileImage(MultipartFile profileImage) {
	}


	/**
	 * 사용자를 검색합니다.
	 *
	 * @param search   검색할 사용자 닉네임
	 * @param pageable 페이지네이션
	 * @return 사용자 조회 페이지
	 */
	public Page<UserEntity> getUserProfileList(String search, Pageable pageable) {
		return Page.empty();
	}


	/**
	 * 나와 같은 식물을 키우는 사람들 조회합니다.
	 *
	 * @return 나와 같은 식물을 키우는 사람들 리스트
	 */
	public List<UserEntity> getSamePlantUserProfileList() {
		return new ArrayList<>();
	}

}
