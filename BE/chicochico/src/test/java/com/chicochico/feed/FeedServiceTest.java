package com.chicochico.feed;


import com.chicochico.domain.feed.service.FeedService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class FeedServiceTest {

	@Mock
	private FeedService feedService;


	@Test
	@DisplayName("추천 피드 목록 조회 성공")
	public void 추천피드목록조회() {
		//given
	}

}
