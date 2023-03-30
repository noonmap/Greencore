package com.chicochico.domain.user.dto.request;


import com.chicochico.common.code.UserStoreType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshRequestDto {

	private UserStoreType authType;

}