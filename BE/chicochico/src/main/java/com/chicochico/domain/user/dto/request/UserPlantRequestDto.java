package com.chicochico.domain.user.dto.request;


import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.Builder;
import lombok.Data;


/**
 * 사용자가 키우는 식물 생성 요청
 */
@Builder
@Data
public class UserPlantRequestDto {

	private Long plantId;
	private String plantNickname;


	public UserPlantEntity toEntity() {
		return (UserPlantEntity) new Object();
	}

}
