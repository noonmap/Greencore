package com.chicochico.domain.feed.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.feed.dto.DiaryRequestDto;
import com.chicochico.domain.feed.dto.DiaryResponseDto;
import com.chicochico.domain.feed.dto.DiarySimpleResponseDto;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.service.DiaryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/diary")
@RequiredArgsConstructor
@Api(tags = "일지 관련 API")
public class DiaryController {

	private final DiaryService diaryService;


	@PostMapping("/{diarySetId}")
	@ApiOperation(value = "해당 관찰일지에 일지를 생성한다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createDiary(@PathVariable Long diarySetId, @RequestPart DiaryRequestDto diaryRequestDto) {
		diaryService.createDiary(diarySetId, diaryRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/{diarySetId}")
	@ApiOperation(value = "해당 관찰일지의 일지 목록을 조회한다.", notes = "")
	public ResponseEntity<ResultDto<List<DiarySimpleResponseDto>>> getDiaryList(@PathVariable Long diarySetId) {
		List<DiaryEntity> diaryEntityList = diaryService.getDiaryList(diarySetId);
		List<DiarySimpleResponseDto> diarySimpleResponseDtoList = DiarySimpleResponseDto.fromEnityList(diaryEntityList);
		return ResponseEntity.ok().body(ResultDto.of(diarySimpleResponseDtoList));
	}


	@GetMapping("/{diaryId}")
	@ApiOperation(value = "해당 일지를 상세 조회한다.", notes = "")
	public ResponseEntity<ResultDto<DiaryResponseDto>> getDiary(@PathVariable Long diaryId) {
		DiaryEntity diary = diaryService.getDiary(diaryId);
		DiaryResponseDto diaryResponseDto = DiaryResponseDto.fromEntity(diary);
		return ResponseEntity.ok().body(ResultDto.of(diaryResponseDto));
	}


	@PutMapping("/{diaryId}")
	@ApiOperation(value = "해당 일지를 수정한다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyDiary(@PathVariable Long diaryId, @RequestPart DiaryRequestDto diaryRequestDto) {
		diaryService.modifyDiary(diaryId, diaryRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{diaryId}")
	@ApiOperation(value = "해당 일지를 삭제한다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteDiary(@PathVariable Long diaryId) {
		diaryService.deleteDiary(diaryId);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
