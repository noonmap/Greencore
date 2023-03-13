package com.chicochico.domain.alert.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.alert.dto.AlertResponseDto;
import com.chicochico.domain.alert.entity.AlertEntity;
import com.chicochico.domain.alert.service.AlertService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/alert")
@RequiredArgsConstructor
@Api(tags = "알림 API") // Swagger 문서의 대분류 항목을 써줌
public class AlertController {

	private final AlertService alertService;


	@GetMapping
	@ApiOperation(value = "알림 목록 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<List<AlertResponseDto>>> getAlertList(@PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

		List<AlertEntity> alertList = alertService.getAlertList(pageable);
		List<AlertResponseDto> alertResponseDtoList = AlertResponseDto.fromEntityList(alertList);

		return ResponseEntity.ok().body(ResultDto.of(alertResponseDtoList));
	}


	@DeleteMapping("/{alertId}")
	@ApiOperation(value = "알림 삭제합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteAlert(@PathVariable Long alertId) {
		alertService.deleteAlert(alertId);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
