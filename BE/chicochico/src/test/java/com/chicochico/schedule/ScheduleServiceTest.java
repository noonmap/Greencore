package com.chicochico.schedule;


import com.chicochico.common.code.IsCompletedType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.schedule.dto.request.ScheduleRequestDto;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.schedule.repository.ScheduleRepository;
import com.chicochico.domain.schedule.service.ScheduleService;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class ScheduleServiceTest {

	@Mock
	UserRepository userRepository;
	@Mock
	UserPlantRepository userPlantRepository;
	@Mock
	PlantRepository plantRepository;
	@Mock
	ScheduleRepository scheduleRepository;
	@InjectMocks
	ScheduleService scheduleService;

	@Mock
	AuthService authService;

	private UserEntity userEntity;
	private PlantEntity plantEntity;
	private UserPlantEntity userPlantEntity;
	private ScheduleEntity scheduleEntity;


	@Test
	public void 일정생성() {

		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(userPlantRepository.findById(any(Long.class))).thenReturn(Optional.of(UserPlantEntity.builder().build()));
		LocalDate localdate1 = LocalDate.of(2023, 4, 1);
		LocalDate localdate2 = LocalDate.of(2023, 4, 3);
		LocalDate localdate3 = LocalDate.of(2023, 4, 7);
		LocalDate localdate4 = LocalDate.of(2023, 4, 30);
		LocalDate localdate5 = LocalDate.of(2023, 5, 2);

		ScheduleRequestDto schedule1 = ScheduleRequestDto.builder()
			.content("content")
			.scheduleDate(localdate1)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.userPlantId(1L)
			.build();
		ScheduleRequestDto schedule2 = ScheduleRequestDto.builder()
			.content("content")
			.scheduleDate(localdate2)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.userPlantId(1L)
			.build();
		ScheduleRequestDto schedule3 = ScheduleRequestDto.builder()
			.content("content")
			.scheduleDate(localdate3)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.userPlantId(1L)
			.build();
		ScheduleRequestDto schedule4 = ScheduleRequestDto.builder()
			.content("content")
			.scheduleDate(localdate4)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.userPlantId(1L)
			.build();
		ScheduleRequestDto schedule5 = ScheduleRequestDto.builder()
			.content("content")
			.scheduleDate(localdate5)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.userPlantId(1L)
			.build();

		scheduleService.createSchedule(schedule1);
		scheduleService.createSchedule(schedule2);
		scheduleService.createSchedule(schedule3);
		scheduleService.createSchedule(schedule4);
		scheduleService.createSchedule(schedule5);

		Assertions.assertThat(scheduleRepository.findAll().size() == 5);
	}
	

	@Test
	@DisplayName("일정목록조회")
	public void 일정목록조회() {

		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));

		LocalDate localdate1 = LocalDate.of(2023, 4, 1);
		LocalDate localdate2 = LocalDate.of(2023, 4, 30);
		LocalDate localdate3 = LocalDate.of(2023, 4, 4);

		List<ScheduleEntity> result1 = scheduleService.getMonthSchedule(2023, 4);
		Assertions.assertThat(result1.size() == 4);

		List<ScheduleEntity> result2 = scheduleService.getWeekSchedule(2023, 4, 1);
		Assertions.assertThat(result2.size() == 2);
	}


	@Test
	@DisplayName("일정삭제")
	public void 일정삭제() {

		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(scheduleRepository.findById(any(Long.class))).thenReturn(Optional.of(ScheduleEntity.builder().build()));

		ScheduleEntity schedule = scheduleRepository.findById(1L).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		scheduleService.deleteSchedule(1L);

		Assertions.assertThat(schedule.getIsDeleted() == IsDeletedType.Y);

	}


	@Test
	@DisplayName("일정완료")
	public void 일정완료() {

		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(scheduleRepository.findById(any(Long.class))).thenReturn(Optional.of(ScheduleEntity.builder().build()));

		ScheduleEntity schedule = scheduleRepository.findById(1L).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		scheduleService.completeSchedule(1L);

		Assertions.assertThat(schedule.getIsCompleted() == IsCompletedType.Y);

	}


	@Test
	@DisplayName("일정완료취소")
	public void 일정완료취소() {

		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(UserEntity.builder().build()));
		when(scheduleRepository.findById(any(Long.class))).thenReturn(Optional.of(ScheduleEntity.builder().build()));

		ScheduleEntity schedule = scheduleRepository.findById(1L).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		scheduleService.incompleteSchedule(1L);

		Assertions.assertThat(schedule.getIsCompleted() == IsCompletedType.N);

	}

}
