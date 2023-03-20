package com.chicochico.plant;


import com.chicochico.domain.plant.controller.PlantController;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.service.PlantService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(PlantController.class)
@MockBean(JpaMetamodelMappingContext.class)
public class PlantControllerTest {

	@MockBean
	PlantService plantService;

	@Autowired
	MockMvc mvc;


	@Test
	@DisplayName("홈화면에서 식물이름을 검색합니다.")
	public void 홈식물이름검색() throws Exception {
		List<PlantEntity> list = new ArrayList<>();

		PlantEntity plant = PlantEntity.builder()
			.id(1L).name("선인장").build();
		list.add(plant);

		PlantEntity plant2 = PlantEntity.builder()
			.id(2L).name("생화").build();
		list.add(plant2);

		PageRequest pageable = PageRequest.of(0, 3);
		Page<PlantEntity> page = new PageImpl<>(list);
		String str = "선";

		given(plantService.getPlantWithImageList(str, pageable)).willReturn(page);

		mvc.perform(get("/plant/docs").param("search", str))
			.andExpect(status().isOk());
	}


	@Test
	@DisplayName("도감페이지에서 식물 목록을 조회합니다.")
	public void 도감식물목록검색() throws Exception {
		List<PlantEntity> list = new ArrayList<>();

		PlantEntity plant = PlantEntity.builder()
			.id(1L).name("선인장").build();
		list.add(plant);

		PlantEntity plant2 = PlantEntity.builder()
			.id(2L).name("생화").build();
		list.add(plant2);

		PageRequest pageable = PageRequest.of(0, 3);
		Page<PlantEntity> page = new PageImpl<>(list);

		String index = "ㅅ";

		mvc.perform(get("/plant/docs").param("index", index).accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk());
	}

}
