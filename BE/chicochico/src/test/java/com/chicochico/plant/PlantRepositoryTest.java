package com.chicochico.plant;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;


@DataJpaTest
@ActiveProfiles("test")
public class PlantRepositoryTest {

	@Mock
	AuthService authService;

	@Autowired
	UserRepository userRepository;
	@Autowired
	PlantRepository plantRepository;


	@Test
	@DisplayName("식물 이름 조회 리스트 테스트")
	public void 식물이름조회테스트() {
		UserEntity user = userRepository.save(UserEntity.builder()
			.id(1L).email("email")
			.password("password")
			.nickname("nickname")
			.profileImagePath("path")
			.introduction("intro")
			.followingCount(0)
			.followerCount(0)
			.isDeleted(IsDeletedType.N).build());

		plantRepository.save(PlantEntity.builder()
			.name("선인장")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("사과나무")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("산수유")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("대나무")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("장미")
			.imagePath("default")
			.userCount(0).build());

		Pageable pageable = PageRequest.of(0, 3);

		Page<PlantEntity> plantEntityPage = plantRepository.findAllByNameContaining("나", pageable);

		Assertions.assertTrue(plantEntityPage.getTotalElements() == 2);
	}


	@Test
	@DisplayName("식물 인덱스 조회 리스트 테스트")
	public void 식물인덱스조회테스트() {
		UserEntity user = userRepository.save(UserEntity.builder()
			.id(1L).email("email")
			.password("password")
			.nickname("nickname")
			.profileImagePath("path")
			.introduction("intro")
			.followingCount(0)
			.followerCount(0)
			.isDeleted(IsDeletedType.N).build());

		plantRepository.save(PlantEntity.builder()
			.name("선인장")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("사과나무")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("쪽파")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("대나무")
			.imagePath("default")
			.userCount(0).build());

		plantRepository.save(PlantEntity.builder()
			.name("장미")
			.imagePath("default")
			.userCount(0).build());

		Pageable pageable = PageRequest.of(0, 3);

		Page<PlantEntity> plantEntityPage = plantRepository.findAllByNameBetween("ㅇ", "ㅈ", pageable);
		Assertions.assertTrue(plantEntityPage.getTotalElements() == 0);
	}

}
