package com.chicochico.domain.feed.controller;


import com.chicochico.common.dto.ResultDto;
import com.chicochico.domain.feed.dto.FeedResponseDto;
import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.service.FeedService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
@Api(tags = "피드 관련 API")
public class FeedController {

	private final FeedService feedService;


	@GetMapping
	@ApiOperation(value = "피드를 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<FeedResponseDto>>> getFeedList(Pageable pageable) {
		Page<FeedEntity> feedEntityPage = feedService.getFeedList(pageable);
		// TODO : entity page -> dto page 변환 추가

		return ResponseEntity.ok().body(ResultDto.of(Page.empty()));
	}


	@GetMapping("/tag")
	@ApiOperation(value = "태그로 피드를 검색한 결과를 조회합니다.", notes = "")
	public ResponseEntity<ResultDto<Page<FeedResponseDto>>> getFeedList(@RequestParam("search") String tag, Pageable pageable) {
		Page<FeedEntity> feedEntityPage = feedService.getFeedListByTag(tag, pageable);
		// TODO : entity page -> dto page 변환 추가

		return ResponseEntity.ok().body(ResultDto.of(Page.empty()));
	}


	@PostMapping("/{feedId}/like")
	@ApiOperation(value = "", notes = "")
	public ResponseEntity<ResultDto<Boolean>> createFeedLike(@PathVariable("feedId") Long feedId) {
		feedService.createFeedLike(feedId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@DeleteMapping("/{feedId}/like")
	@ApiOperation(value = "", notes = "")
	public ResponseEntity<ResultDto<Boolean>> deleteFeedLike(@PathVariable("feedId") Long feedId) {
		feedService.deleteFeedLike(feedId);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}

}
