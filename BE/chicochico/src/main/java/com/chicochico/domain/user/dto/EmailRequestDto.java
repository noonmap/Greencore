package com.chicochico.domain.user.dto;


import com.chicochico.domain.user.entity.UserEntity;
import lombok.Data;


/**
 * 이메일 인증 요청
 */
@Data
public class EmailRequestDto {

	public UserEntity toEntity() {
		return (UserEntity) new Object();
	}

}
