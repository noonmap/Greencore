package com.chicochico.feed.service;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class PostServiceTest {

	@Nested
	@DisplayName("게시글 목록 조회")
	class 조회 {

		@Test
		@DisplayName("작성자 유저가 존재하지 않는 경우")
		public void test1() {

		}


		@Test
		@DisplayName("작성자 유저가 탈퇴한 경우")
		public void test2() {

		}


		@Test
		@DisplayName("삭제된 게시글 조회되면 안됨")
		public void test3() {

		}

	}

	@Nested
	@DisplayName("게시글 목록 상세조회")
	class 상세조회 {

		@Test
		@DisplayName("작성자 유저가 탈퇴한 경우")
		public void test2() {

		}


		@Test
		@DisplayName("삭제된 게시글 조회되면 안됨")
		public void test3() {

		}

	}

	@Nested
	@DisplayName("게시글 생성")
	class 생성 {

		@Test
		@DisplayName("Not Null인 필드가 비어있는 경우")
		public void test2() {

		}

	}

	@Nested
	@DisplayName("게시글 수정")
	class 수정 {

		@Test
		@DisplayName("게시글이 존재하지 않는 경우")
		public void test1() {

		}


		@Test
		@DisplayName("Not Null인 필드가 비어있는 경우")
		public void test2() {

		}


		@Test
		@DisplayName("삭제된 게시글인 경우 수정되면 안됨")
		public void test3() {

		}

	}

	@Nested
	@DisplayName("게시글 삭제")
	class 삭제 {

		@Test
		@DisplayName("게시글이 존재하지 않는 경우")
		public void test2() {

		}


		@Test
		@DisplayName("이미 삭제된 게시글인 경우 비정상 요청임")
		public void test3() {

		}

	}

}
