package com.chicochico.domain.user.dto.request;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 회원 가입
 */
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RegisterRequestDto {

	private String email;
	private String nickname;
	private String password;


	public UserEntity toEntity() {
		return UserEntity.builder()
			.email(email)
			.nickname(nickname)
			.password(password)
			.build();
	}

}