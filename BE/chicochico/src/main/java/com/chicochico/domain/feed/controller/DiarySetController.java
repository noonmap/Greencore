package com.chicochico.domain.feed.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.feed.dto.request.DiarySetRequestDto;
import com.chicochico.domain.feed.dto.response.DiarySetResponseDto;
import com.chicochico.domain.feed.dto.response.DiarySetSimpleResponseDto;
import com.chicochico.domain.feed.entity.DiarySetEntity;
import com.chicochico.domain.feed.service.DiarySetService;
import com.chicochico.domain.user.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/diaryset") // 공통되는 도메인 url을 써줌
@RequiredArgsConstructor
@Api(tags = "관찰 일지 API") // Swagger 문서의 대분류 항목을 써줌
public class DiarySetController {

	private final DiarySetService diarySetService;

	private final UserService userService;
	private final AuthService authService;


	@GetMapping("/{nickname}/list") // notion의 API docs를 참고해서 url 매핑을 해준다.
	@ApiOperation(value = "관찰 일지 목록을 조회합니다.", notes = "") // Swagger 문서에 들어갈 API 설명을 적음. (notes는 부가 상세 설명임. optional함)
	public ResponseEntity<ResultDto<Page<DiarySetResponseDto>>> getDiarySetList(@PathVariable("nickname") String nickname, Pageable pageable) { // notion의 API docs를 참고해서 response, request를 적음.
		/*
		 * 페이지네이션할 때 page, size는 @RequestParam으로 각각 주지말고 Pageable 사용하기
		 *
		 * service 메소드 빠르게 만드는 방법!
		 * 1. Controller에서 아래처럼 "반환받을 데이터 = service.메소드(파라미터들)" 이렇게 만든다.
		 * 2. 서비스 메소드가 안 만들어져서 빨간 표시가 뜰텐데, 마우스 오버하면 "Create method 어쩌고" 문구가 뜬다. 그걸 클릭함
		 * 3. 그럼 service 클래스에 메소드 구현체가 자동으로 생성된다!
		 * */
		List<DiarySetEntity> diarySetPage = diarySetService.getDiarySetList(nickname);
		Page<DiarySetResponseDto> diarySetResponseDtos = DiarySetResponseDto.fromEntityPage(diarySetPage, pageable, diarySetService::isBookmarked);
		return ResponseEntity.ok().body(ResultDto.of(diarySetResponseDtos));
	}


	@PostMapping
	@ApiOperation(value = "관찰 일지를 생성합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createDiarySet(DiarySetRequestDto diarySetRequestDto) {
		diarySetService.createDiarySet(diarySetRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/{diarySetId}")
	@ApiOperation(value = "관찰 일지를 수정합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> modifyDiarySet(@PathVariable("diarySetId") Long diarySetId, DiarySetRequestDto diarySetRequestDto) {
		diarySetService.modifyDiarySet(diarySetId, diarySetRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{diarySetId}")
	@ApiOperation(value = "관찰 일지를 삭제합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteDiarySet(@PathVariable("diarySetId") Long diarySetId) {
		diarySetService.deleteDiarySet(diarySetId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/{nickname}/bookmark")
	@ApiOperation(value = "유저가 북마크한 관찰 일지 목록을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<DiarySetResponseDto>>> getDiarySetBookmarkList(@PathVariable("nickname") String nickname, Pageable pageable) {
		List<DiarySetEntity> diarySetPage = diarySetService.getDiarySetBookmarkList(nickname, pageable);
		Page<DiarySetResponseDto> diarySetResponseDtos = DiarySetResponseDto.fromEntityPage(diarySetPage, pageable, diarySetService::isBookmarked);
		return ResponseEntity.ok().body(ResultDto.of(diarySetResponseDtos));
	}


	@GetMapping("/population")
	@ApiOperation(value = "인기 관찰 일지를 2개 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<List<DiarySetSimpleResponseDto>>> getPopularDiarySetList() {
		List<DiarySetEntity> diarySetList = diarySetService.getPopularDiarySetList();
		List<DiarySetSimpleResponseDto> diarySetSimpleResponseDtoList = DiarySetSimpleResponseDto.fromEnityList(diarySetList);

		return ResponseEntity.ok().body(ResultDto.of(diarySetSimpleResponseDtoList));
	}


	@PostMapping("/{diarySetId}/bookmark")
	@ApiOperation(value = "관찰 일지를 북마크합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createBookmark(@PathVariable("diarySetId") Long diarySetId) {
		diarySetService.createBookmark(diarySetId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{diarySetId}/bookmark")
	@ApiOperation(value = "관찰 일지 북마크를 취소(삭제)합니다.", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteBookmark(@PathVariable("diarySetId") Long diarySetId) {
		diarySetService.deleteBookmark(diarySetId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
