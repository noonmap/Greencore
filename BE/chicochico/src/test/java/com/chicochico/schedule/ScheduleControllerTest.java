package com.chicochico.schedule;


import com.chicochico.common.service.AuthService;
import com.chicochico.domain.schedule.controller.ScheduleController;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.schedule.repository.ScheduleRepository;
import com.chicochico.domain.schedule.service.ScheduleService;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(ScheduleController.class)
@MockBean(JpaMetamodelMappingContext.class)
public class ScheduleControllerTest {

	@MockBean
	ScheduleService scheduleService;
	@MockBean
	AuthService authService;
	@Autowired
	UserRepository userRepository;
	@Autowired
	ScheduleRepository scheduleRepository;

	@Autowired
	MockMvc mvc;


	@Test
	@DisplayName("일정 리스트를 조회합니다.")
	public void 일정리스트조회() throws Exception {
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(scheduleRepository.findById(any(Long.class))).thenReturn(Optional.of(ScheduleEntity.builder().build()));

		Integer year = 2023;
		Integer month = 4;
		mvc.perform(get("/schedule").param("year", String.valueOf(year)).param("month", String.valueOf(month)))
			.andExpect(status().isOk());
	}


	@Test
	@DisplayName("일정을 생성합니다.")
	public void 일정생성() throws Exception {
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(scheduleRepository.findById(any(Long.class))).thenReturn(Optional.of(ScheduleEntity.builder().build()));

		mvc.perform(post("/schedule"))
			.andExpect(status().isOk());
	}


	@Test
	@DisplayName("일정을 수정합니다.")
	public void 일정수정() throws Exception {
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(scheduleRepository.findById(any(Long.class))).thenReturn(Optional.of(ScheduleEntity.builder().build()));

		mvc.perform(put("/schedule/1"))
			.andExpect(status().isOk());
	}


	@Test
	@DisplayName("일정을 삭제합니다.")
	public void 일정삭제() throws Exception {
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(scheduleRepository.findById(any(Long.class))).thenReturn(Optional.of(ScheduleEntity.builder().build()));

		mvc.perform(delete("/schedule/1"))
			.andExpect(status().isOk());
	}

}
