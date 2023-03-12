package com.chicochico.feed;

import com.chicochico.domain.feed.repository.DiarySetRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class DiarySetServiceTest {

	@Mock
	private DiarySetRepository diarySetRepository;

	// user 로그인 상태 확인


	// [성공] 모든 필드가 다 채워져있는 경우 ->  id가 not null인지, 저장된 필드들이 다 notnull혹은 value가 정상적인지
	@Test
	public void 관찰일지생성성공(){
		// when
	}

}
