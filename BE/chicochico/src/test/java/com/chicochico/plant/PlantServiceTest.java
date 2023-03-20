package com.chicochico.plant;


import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.plant.service.PlantService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class PlantServiceTest {

	@Mock
	private PlantRepository plantRepository;
	@InjectMocks
	private PlantService plantService;
	

	@Test
	public void 식물이름검색() {
		List<PlantEntity> list = new ArrayList<>();

		PlantEntity plant = PlantEntity.builder()
			.id(1L).name("선인장").build();
		list.add(plant);

		PlantEntity plant2 = PlantEntity.builder()
			.id(2L).name("선인장").build();
		list.add(plant2);

		PageRequest pageable = PageRequest.of(0, 5);
		Page<PlantEntity> page = new PageImpl<>(list);

		when(plantRepository.findAllByNameContaining("선", pageable)).thenReturn(page);
		Page<PlantEntity> result = plantService.getPlantList("선", pageable);
		Assertions.assertThat((result.toList().get(0)).getName()).isNotNull().isInstanceOf(String.class);

	}


	@Test
	public void 식물인덱스검색() {
		List<PlantEntity> list = new ArrayList<>();

		PlantEntity plant = PlantEntity.builder()
			.id(1L).name("선인장").build();
		list.add(plant);

		PlantEntity plant2 = PlantEntity.builder()
			.id(2L).name("선인장").build();
		list.add(plant2);

		PageRequest pageable = PageRequest.of(0, 5);
		Page<PlantEntity> page = new PageImpl<>(list);

		lenient().when(plantRepository.findAllByNameBetween("ㅅ", "ㅇ", pageable)).thenReturn(page);

		Page<PlantEntity> result = plantService.getPlantListByIndex("ㅅ", pageable);

		Assertions.assertThat((result.toList().get(0)).getName()).isNotNull().isInstanceOf(String.class);
	}

}
