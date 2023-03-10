package com.chicochico.domain.feed.service;


import com.chicochico.domain.feed.entity.FeedEntity;
import com.chicochico.domain.feed.repository.FeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class FeedService {

	private final FeedRepository feedRepository;


	/**
	 * 피드를 조회합니다.
	 *
	 * @param pageable 페이지네이션
	 * @return 피드 조회 페이지
	 */
	public Page<FeedEntity> getFeedList(Pageable pageable) {
		return Page.empty();
	}


	/**
	 * 태그로 피드를 검색한 결과를 조회합니다.
	 *
	 * @param tag      검색할 태그
	 * @param pageable 페이지네이션
	 * @return 피드 조회 페이지
	 */
	public Page<FeedEntity> getFeedListByTag(String tag, Pageable pageable) {

		return Page.empty();
	}


	/**
	 * 피드 좋아요 생성
	 *
	 * @param feedId 좋아요 추가할 피드
	 */
	public void createFeedLike(Long feedId) {
	}


	/**
	 * 피드 좋아요 취소
	 *
	 * @param feedId 좋아요 취소할 피드
	 */
	public void deleteFeedLike(Long feedId) {
	}

}
