package com.chicochico.domain.plant.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.plant.dto.response.PlantDocResponseDto;
import com.chicochico.domain.plant.dto.response.PlantResponseDto;
import com.chicochico.domain.plant.dto.response.PlantWithImageResponseDto;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.service.PlantService;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/plant")
@RequiredArgsConstructor
@Api(tags = "식물 API")
public class PlantController {

	private final PlantService plantService;


	@GetMapping
	@ApiOperation(value = "홈화면에서 식물이름을 검색합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<PlantWithImageResponseDto>>> getPlantWithImageList(@RequestParam("search") String search,
		@PageableDefault(size = 12, sort = "name") Pageable pageable) {
		Page<PlantEntity> plantList = plantService.getPlantWithImageList(search, pageable);
		Page<PlantWithImageResponseDto> plantWithImageResponseDtoPage = PlantWithImageResponseDto.fromEnityPage(plantList);

		int page = pageable.getPageNumber();
		if (page != 0 && plantWithImageResponseDtoPage.getTotalPages() <= page) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

		return ResponseEntity.ok().body(ResultDto.of(plantWithImageResponseDtoPage));
	}


	@GetMapping("/user")
	@ApiOperation(value = "내가 키우는 식물 추가를 위해 식물이름을 검색합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<PlantResponseDto>>> getPlantListAtMyPage(@RequestParam("search") String search,
		@PageableDefault(size = 12, sort = "name") Pageable pageable) {
		Page<PlantEntity> plantList = plantService.getPlantListAtMyPage(search, pageable);
		Page<PlantResponseDto> plantResponseDtoPage = PlantResponseDto.fromEnityPage(plantList);

		int page = pageable.getPageNumber();
		if (page != 0 && plantResponseDtoPage.getTotalPages() <= page) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

		return ResponseEntity.ok().body(ResultDto.of(plantResponseDtoPage));
	}


	@GetMapping(value = "/docs", params = { "search" })
	@ApiOperation(value = "도감페이지에서 식물이름을 검색합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<PlantResponseDto>>> getPlantList(@RequestParam("search") String search,
		@PageableDefault(size = 12, sort = "name") Pageable pageable) {
		Page<PlantEntity> plantList = plantService.getPlantList(search, pageable);
		Page<PlantResponseDto> plantResponseDtoPage = PlantResponseDto.fromEnityPage(plantList);

		int page = pageable.getPageNumber();
		if (page != 0 && plantResponseDtoPage.getTotalPages() <= page) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

		return ResponseEntity.ok().body(ResultDto.of(plantResponseDtoPage));
	}


	@GetMapping(value = "/docs", params = { "index" })
	@ApiOperation(value = "식물 도감 목록을 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<PlantResponseDto>>> getPlantListByIndex(@RequestParam("index") String index,
		@PageableDefault(size = 12, sort = "name") Pageable pageable) {
		Page<PlantEntity> plantList = plantService.getPlantListByIndex(index, pageable);
		Page<PlantResponseDto> plantResponseDtoPage = PlantResponseDto.fromEnityPage(plantList);

		int page = pageable.getPageNumber();
		if (page != 0 && plantResponseDtoPage.getTotalPages() <= page) {
			throw new CustomException(ErrorCode.PAGE_NOT_FOUND);
		}

		return ResponseEntity.ok().body(ResultDto.of(plantResponseDtoPage));
	}


	@GetMapping("/docs/{plantId}")
	@ApiOperation(value = "식물 도감에서 상세 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<PlantDocResponseDto>> getPlant(@PathVariable("plantId") Long plantId) {
		PlantEntity plant = plantService.getPlant(plantId);
		PlantDocResponseDto plantDocResponseDto = PlantDocResponseDto.fromEntity(plant);

		return ResponseEntity.ok().body(ResultDto.of(plantDocResponseDto));
	}


	@GetMapping("/population")
	@ApiOperation(value = "인기 식물를 3개 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<List<PlantWithImageResponseDto>>> getPopularPlantList() {
		List<PlantEntity> plantList = plantService.getPopularPlantList();
		List<PlantWithImageResponseDto> plantWithImageResponseDtoList = PlantWithImageResponseDto.fromEnityList(plantList);

		return ResponseEntity.ok().body(ResultDto.of(plantWithImageResponseDtoList));
	}

}
