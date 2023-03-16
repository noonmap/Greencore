package com.chicochico.feed.repository;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.domain.feed.entity.*;
import com.chicochico.domain.feed.repository.*;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;


@DataJpaTest
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // h2 db가 아닌 실제 db를 사용하고 싶을 때
@ActiveProfiles("test")
public class FeedRepositoryTest {

	private final String DEFAULT_IMAGE_PATH = "/image/default.png";
	@Autowired
	FeedRepository feedRepository;
	@Autowired
	DiaryRepository diaryRepository;
	@Autowired
	DiarySetRepository diarySetRepository;
	@Autowired
	PlantRepository plantRepository;
	@Autowired
	UserPlantRepository userPlantRepository;
	@Autowired
	UserRepository userRepository;

	@Autowired
	TagRepository tagRepository;
	@Autowired
	FeedTagRepository feedTagRepository;

	private UserEntity userEntity;
	private UserPlantEntity userPlantEntity;
	private DiarySetEntity diarySetEntity;


	@BeforeEach
	public void init() {
		PlantEntity plantEntity = plantRepository.save(PlantEntity.builder().name("tomato").build());
		userEntity = userRepository.save(UserEntity.builder()
			.email("email")
			.password("password")
			.nickname("nickname")
			.profileImagePath("path")
			.introduction("intro")
			.followingCount(0)
			.followerCount(0)
			.isDeleted(IsDeletedType.N)
			.build());
		userPlantEntity = userPlantRepository.save(UserPlantEntity.builder()
			.user(userEntity)
			.plant(plantEntity)
			.plantNickname("cute tomato")
			.plantImagePath("path")
			.isDeleted(IsDeletedType.N)
			.build());
		diarySetEntity = diarySetRepository.save(DiarySetEntity.builder()
			.user(userEntity)
			.userPlant(userPlantEntity)
			.title("title")
			.imagePath("/default")
			.diaryCount(0)
			.isDeleted(IsDeletedType.N)
			.build());

	}


	public UserEntity doUserEntity() {
		return UserEntity.builder()
			.email("email")
			.password("password")
			.nickname("nickname")
			.profileImagePath("path")
			.introduction("intro")
			.followingCount(0)
			.followerCount(0)
			.isDeleted(IsDeletedType.N)
			.build();
	}


	public DiaryEntity doDiaryEntity(UserEntity user) {
		return DiaryEntity.builder()
			.user(user)
			.content("diary content")
			.imagePath(DEFAULT_IMAGE_PATH)
			.likeCount(0)
			.isDeleted(IsDeletedType.N)
			.observationDate(LocalDate.now())
			.diarySet(diarySetEntity)
			.build();
	}


	@Test
	@DisplayName("여러 유저가 쓴 피드 조회 테스트")
	public void 유저를통한피드조회테스트() {
		// given
		Pageable pageable = PageRequest.of(0, 10);
		UserEntity user1 = userRepository.save(doUserEntity());
		UserEntity user2 = userRepository.save(doUserEntity());
		UserEntity user3 = userRepository.save(doUserEntity());
		List<UserEntity> userIds = List.of(user1, user3); // 1번, 3번 user의 피드만 조회
		DiaryEntity diary1 = diaryRepository.save(doDiaryEntity(user1));
		DiaryEntity diary2 = diaryRepository.save(doDiaryEntity(user2)); // 이건 2번 user의 피드이므로 조회되면 안된다.
		DiaryEntity diary3 = diaryRepository.save(doDiaryEntity(user3));

		// when
		Page<FeedEntity> result = feedRepository.findByUserIn(userIds, pageable);

		// then
		// id=2가 빠졌는지 확인
		Assertions.assertTrue(result.toList().size() == 2); // diary1, diary3 두 개만 있는지 확인
		Assertions.assertTrue(result.toList().contains(diary1)); // 조회되었는지 확인
		Assertions.assertFalse(result.toList().contains(diary2)); // 조회X인지 확인
		Assertions.assertTrue(result.toList().contains(diary3)); // 조회되었는지 확인
	}


	@Test
	@DisplayName("여러 태그 리스트가 주어졌을 때, 리스트에 포함된 태그르 가지고 있는 feedTag를 한번에 조회")
	public void FeedTagINQueryTest() {
		// given
		TagEntity tag1 = tagRepository.save(TagEntity.builder().content("tag1").build());
		TagEntity tag2 = tagRepository.save(TagEntity.builder().content("tag2").build()); // 이건 조회하지 않음
		TagEntity tag3 = tagRepository.save(TagEntity.builder().content("tag3").build());
		UserEntity user1 = userRepository.save(doUserEntity());
		DiaryEntity diary1 = diaryRepository.save(doDiaryEntity(user1));
		FeedTagEntity ft1 = feedTagRepository.save(FeedTagEntity.builder().tag(tag1).feed(diary1).build());
		FeedTagEntity ft2 = feedTagRepository.save(FeedTagEntity.builder().tag(tag2).feed(diary1).build());
		FeedTagEntity ft3 = feedTagRepository.save(FeedTagEntity.builder().tag(tag3).feed(diary1).build());
		List<TagEntity> tagList = List.of(tag1, tag3);

		// when
		List<FeedTagEntity> result = feedTagRepository.findByTag(tagList); // tag1, tag3이 포함된 feed

		// then
		Assertions.assertTrue(result.size() == 2); // tag1, tag3만 포함되었는지 확인
		Assertions.assertTrue(result.contains(ft1));
		Assertions.assertFalse(result.contains(ft2));
		Assertions.assertTrue(result.contains(ft3));
	}


	@Test
	@DisplayName("태그 대소문자 안 가리고 검색되는지 테스트")
	public void 태그대소문자구분X테스트() {
		// given
		TagEntity tag1 = tagRepository.save(TagEntity.builder().content("tag11").build());
		TagEntity tag2 = tagRepository.save(TagEntity.builder().content("tag12").build()); // 이건 조회하지 않음
		TagEntity tag3 = tagRepository.save(TagEntity.builder().content("tag21").build());

		// when
		List<TagEntity> result = tagRepository.findByContentContainingIgnoreCase("Tag"); // tag1, tag3이 포함된 feed

		// then
		Assertions.assertTrue(result.size() == 3); // tag1, tag3만 포함되었는지 확인
		Assertions.assertTrue(result.contains(tag1));
		Assertions.assertTrue(result.contains(tag2));
		Assertions.assertTrue(result.contains(tag3));
	}


	@Test
	@DisplayName("태그 미포함한 피드 검색 안되는지 테스트")
	public void 태그미포함한피드X테스트() {
		// given
		TagEntity tag1 = tagRepository.save(TagEntity.builder().content("tag").build()); // 검색X
		TagEntity tag3 = tagRepository.save(TagEntity.builder().content("search_tag").build()); // 검색O

		// when
		List<TagEntity> result = tagRepository.findByContentContainingIgnoreCase("Search"); // tag3이 포함된 feed

		// then
		Assertions.assertTrue(result.size() == 1); // tag3만 포함되었는지 확인
		Assertions.assertFalse(result.contains(tag1));
		Assertions.assertTrue(result.contains(tag3));
	}

}
