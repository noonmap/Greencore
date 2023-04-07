package com.chicochico.domain.schedule.controller;


import com.chicochico.common.code.RegularScheduleType;
import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.schedule.dto.request.ScheduleRequestDto;
import com.chicochico.domain.schedule.dto.response.RegularScheduleResponseDto;
import com.chicochico.domain.schedule.dto.response.ScheduleResponseDto;
import com.chicochico.domain.schedule.entity.RegularScheduleEntity;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.schedule.service.ScheduleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
@Api(tags = "일정 API") // Swagger 문서의 대분류 항목을 써줌
public class ScheduleController {

	private final ScheduleService scheduleService;


	@GetMapping(params = { "year", "month" })
	@ApiOperation(value = "본인이 작성한 일정 중 특정 달에 해당하는 일정 목록을 리턴받습니다 .", notes = "")
	public ResponseEntity<ResultDto<List<ScheduleResponseDto>>> getMonthSchedule(@RequestParam Integer year, @RequestParam Integer month) {
		LocalDate date = LocalDate.of(year, month, 1);
		scheduleService.createRegularSchedule(date);
		List<ScheduleEntity> scheduleEntityList = scheduleService.getMonthSchedule(year, month);
		List<ScheduleResponseDto> scheduleResponseDtoList = ScheduleResponseDto.fromEnityMonthList(scheduleEntityList);

		return ResponseEntity.status(HttpStatus.OK).body(ResultDto.of(scheduleResponseDtoList));
	}


	@GetMapping(params = { "year", "month", "day" })
	@ApiOperation(value = "본인이 작성한 일정 중 특정 주에 해당하는 일정 목록을 리턴받습니다 .", notes = "")
	public ResponseEntity<ResultDto<List<ScheduleResponseDto>>> getWeekSchedule(@RequestParam Integer year, @RequestParam Integer month, @RequestParam Integer day) {
		List<ScheduleEntity> scheduleEntityList = scheduleService.getWeekSchedule(year, month, day);
		List<ScheduleResponseDto> scheduleWeekResponseDtoList = ScheduleResponseDto.fromEnityWeeekList(scheduleEntityList);

		return ResponseEntity.status(HttpStatus.OK).body(ResultDto.of(scheduleWeekResponseDtoList));
	}


	@PostMapping
	@ApiOperation(value = "일정을 생성합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createSchedule(@RequestBody ScheduleRequestDto scheduleRequestDto) {
		//하루 일정
		if (scheduleRequestDto.getRegularScheduleCode() == null || scheduleRequestDto.getRegularScheduleCode().equals("")) {
			scheduleService.createSchedule(scheduleRequestDto);
		}
		//주간 정기 일정
		else if (scheduleRequestDto.getRegularScheduleCode().equals(RegularScheduleType.WEEKLY_SCHEDULE)) {
			scheduleService.createWeeklySchedule(scheduleRequestDto);
		}
		//월간 정기 일정
		else if (scheduleRequestDto.getRegularScheduleCode().equals(RegularScheduleType.MONTHLY_SCHEDULE)) {
			scheduleService.createMonthlySchedule(scheduleRequestDto);
		}

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/regular")
	@ApiOperation(value = "정기 일정 목록을 조회합니다.")
	public ResponseEntity<ResultDto<List<RegularScheduleResponseDto>>> getRegularScheduleList() {
		List<RegularScheduleEntity> regularScheduleList = scheduleService.getRegularScheduleList();
		List<RegularScheduleResponseDto> result = RegularScheduleResponseDto.fromEntityList(regularScheduleList);
		return ResponseEntity.ok().body(ResultDto.of(result));
	}


	@DeleteMapping("/regular/{regularId}")
	@ApiOperation(value = "정기 일정을 현재 시간 부로 삭제합니다.")

	public ResponseEntity<ResultDto<Boolean>> deleteRegularSchedule(@PathVariable Long regularId) {
		scheduleService.deleteRegularSchedule(regularId);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/regular/{regularId}")
	@ApiOperation(value = "정기 일정을 현재 시간 부로 수정합니다.")
	public ResponseEntity<ResultDto<Boolean>> modifyRegularSchedule(@PathVariable Long regularId, @RequestBody ScheduleRequestDto scheduleRequestDto) {
		scheduleService.modifyRegularSchedule(regularId, scheduleRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/{scheduleId}")
	@ApiOperation(value = "일정을 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifySchedule(@PathVariable Long scheduleId, @RequestBody ScheduleRequestDto scheduleRequestDto) {
		scheduleService.modifySchedule(scheduleId, scheduleRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{scheduleId}")
	@ApiOperation(value = "일정을 삭제합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteSchedule(@PathVariable Long scheduleId) {
		scheduleService.deleteSchedule(scheduleId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PostMapping("/{scheduleId}/done")
	@ApiOperation(value = "일정 완료로 등록합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> completeSchedule(@PathVariable Long scheduleId) {
		scheduleService.completeSchedule(scheduleId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{scheduleId}/done")
	@ApiOperation(value = "일정 완료를 취소합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> incompleteSchedule(@PathVariable Long scheduleId) {
		scheduleService.incompleteSchedule(scheduleId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
