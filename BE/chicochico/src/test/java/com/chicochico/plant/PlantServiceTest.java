package com.chicochico.plant;


import com.chicochico.common.service.AuthService;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.plant.service.PlantService;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;
import static org.mockito.Mockito.times;


@ExtendWith(MockitoExtension.class)
public class PlantServiceTest {

	@Mock
	UserRepository userRepository;
	@Mock
	AuthService authService;
	@Mock
	private PlantRepository plantRepository;
	@InjectMocks
	private PlantService plantService;


	@Test
	@DisplayName("도감페이지에서 식물 목록을 조회합니다. (이름 검색)")
	public void 식물이름검색() {

		UserEntity user = UserEntity.builder().id(1L).build();

		PlantEntity plant = PlantEntity.builder()
			.name("선인장")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant);

		PlantEntity plant2 = PlantEntity.builder()
			.name("장미")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant2);

		PlantEntity plant3 = PlantEntity.builder()
			.name("산수유")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant3);

		PlantEntity plant4 = PlantEntity.builder()
			.name("사과나무")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant4);

		PlantEntity plant5 = PlantEntity.builder()
			.name("페퍼민트")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant5);

		PlantEntity plant6 = PlantEntity.builder()
			.name("라벤더")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant6);

		Pageable pageable = PageRequest.of(0, 3);

		assertThatCode(() -> {
			plantService.getPlantList("사", pageable);
		}).doesNotThrowAnyException();
		Mockito.verify(plantRepository, times(1)).findAllByNameContaining("사", pageable);

	}


	@Test
	@DisplayName("도감페이지에서 식물 목록을 조회합니다. (인덱스)")
	public void 식물인덱스검색() {
		UserEntity user = UserEntity.builder().id(1L).build();

		PlantEntity plant = PlantEntity.builder()
			.name("선인장")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant);

		PlantEntity plant2 = PlantEntity.builder()
			.name("장미")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant2);

		PlantEntity plant3 = PlantEntity.builder()
			.name("산수유")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant3);

		PlantEntity plant4 = PlantEntity.builder()
			.name("사과나무")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant4);

		PlantEntity plant5 = PlantEntity.builder()
			.name("페퍼민트")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant5);

		PlantEntity plant6 = PlantEntity.builder()
			.name("라벤더")
			.imagePath("default")
			.userCount(0)
			.build();
		plantRepository.save(plant6);

		Pageable pageable = PageRequest.of(0, 3);

		assertThatCode(() -> {
			plantService.getPlantListByIndex("ㅅ", pageable);
		}).doesNotThrowAnyException();
		Mockito.verify(plantRepository, times(1)).findAllByNameBetween("ㅅ", "ㅇ", pageable);

	}

}
