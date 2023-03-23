package com.chicochico.domain.feed.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.feed.dto.request.DiaryRequestDto;
import com.chicochico.domain.feed.dto.response.DiaryResponseDto;
import com.chicochico.domain.feed.dto.response.DiarySimpleResponseDto;
import com.chicochico.domain.feed.entity.DiaryEntity;
import com.chicochico.domain.feed.service.DiaryService;
import com.chicochico.domain.feed.service.FeedService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@Api(tags = "일지 관련 API")
public class DiaryController {

	private final DiaryService diaryService;
	private final FeedService feedService;


	@PostMapping("/diaryset/{diarySetId}")
	@ApiOperation(value = "해당 관찰일지에 일지를 생성한다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createDiary(@PathVariable Long diarySetId, DiaryRequestDto diaryRequestDto) {
		diaryService.createDiary(diarySetId, diaryRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/diaryset/list/{diarySetId}")
	@ApiOperation(value = "해당 관찰일지의 일지 목록을 조회한다.", notes = "")
	public ResponseEntity<ResultDto<Page<DiarySimpleResponseDto>>> getDiaryList(@PathVariable Long diarySetId, Pageable pageable) {
		Page<DiaryEntity> diaryEntityPage = diaryService.getDiaryList(diarySetId, pageable);
		Page<DiarySimpleResponseDto> diarySimpleResponseDtoList = DiarySimpleResponseDto.fromEnityPage(diaryEntityPage, pageable, feedService::getTagContentList);
		return ResponseEntity.ok().body(ResultDto.of(diarySimpleResponseDtoList));
	}


	@GetMapping("/diary/{diaryId}")
	@ApiOperation(value = "해당 일지를 상세 조회한다.", notes = "")
	public ResponseEntity<ResultDto<DiaryResponseDto>> getDiary(@PathVariable Long diaryId) {
		DiaryEntity diary = diaryService.getDiary(diaryId);
		DiaryResponseDto diaryResponseDto = DiaryResponseDto.fromEntity(diary, feedService::getTagContentList);
		return ResponseEntity.ok().body(ResultDto.of(diaryResponseDto));
	}


	@PutMapping("/diary/{diaryId}")
	@ApiOperation(value = "해당 일지를 수정한다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyDiary(@PathVariable Long diaryId, DiaryRequestDto diaryRequestDto) {
		diaryService.modifyDiary(diaryId, diaryRequestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/diary/{diaryId}")
	@ApiOperation(value = "해당 일지를 삭제한다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteDiary(@PathVariable Long diaryId) {
		diaryService.deleteDiary(diaryId);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
