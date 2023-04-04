package com.chicochico.domain.user.dto.request;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 유저 프로필 정보 생성, 수정 요청
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequestDto {

	private String nickname;
	private String introduction;


	public UserEntity toEntity(UserEntity user) {
		return UserEntity.builder()
			.id(user.getId())
			.email(user.getEmail())
			.password(user.getPassword())
			.nickname(nickname)
			.profileImagePath(user.getProfileImagePath())
			.introduction(introduction)
			.followerCount(user.getFollowerCount())
			.followingCount(user.getFollowingCount())
			.isDeleted(user.getIsDeleted())
			.userStore(user.getUserStore())
			.build();
	}

}
