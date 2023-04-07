package com.chicochico.domain.user.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 사용자가 키우는 식물 닉네임 수정 요청
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPlantSimpleRequestDto {

	private String plantNickname;

}
