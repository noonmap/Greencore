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
	public void INQueryTest() {
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

}
