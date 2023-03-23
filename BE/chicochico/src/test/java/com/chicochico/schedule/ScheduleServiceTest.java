package com.chicochico.schedule;


import com.chicochico.common.code.IsCompletedType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.schedule.dto.request.ScheduleRequestDto;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.schedule.repository.ScheduleRepository;
import com.chicochico.domain.schedule.service.ScheduleService;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.times;
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

	private MockMvc mockMvc;


	@Test
	public void 일정생성() {

		UserEntity user = UserEntity.builder().id(1L).build();
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		UserPlantEntity userPlant = UserPlantEntity.builder().id(1L).user(user).build();
		when(userPlantRepository.findById(1L)).thenReturn(Optional.of(userPlant));
		LocalDate localdate1 = LocalDate.of(2023, 4, 1);

		ScheduleRequestDto schedule1 = ScheduleRequestDto.builder()
			.content("content")
			.userPlantId(1L)
			.scheduleDate(localdate1)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();

		ScheduleEntity schedule = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate1)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();

		assertThatCode(() -> {
			scheduleService.createSchedule(schedule1);
		}).doesNotThrowAnyException();
		Mockito.verify(scheduleRepository, times(1)).save(refEq(schedule));
	}


	@Test
	@DisplayName("일정목록조회")
	public void 일정목록조회() {

		UserEntity user = UserEntity.builder().id(1L).build();
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		UserPlantEntity userPlant = UserPlantEntity.builder().id(1L).user(user).build();

		LocalDate localdate1 = LocalDate.of(2023, 4, 1);
		LocalDate localdate2 = LocalDate.of(2023, 4, 3);
		LocalDate localdate3 = LocalDate.of(2023, 4, 7);
		LocalDate localdate4 = LocalDate.of(2023, 4, 30);
		LocalDate localdate5 = LocalDate.of(2023, 5, 2);
		LocalDate localdate6 = LocalDate.of(2023, 5, 1);
		LocalDate localdate7 = LocalDate.of(2023, 4, 4);

		ScheduleEntity schedule = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate1)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		scheduleRepository.save(schedule);
		ScheduleEntity schedule1 = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate2)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		scheduleRepository.save(schedule1);
		ScheduleEntity schedule2 = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate3)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		scheduleRepository.save(schedule2);
		ScheduleEntity schedule3 = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate4)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		scheduleRepository.save(schedule3);
		ScheduleEntity schedule4 = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate5)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		scheduleRepository.save(schedule4);

		assertThatCode(() -> {
			scheduleService.getMonthSchedule(2023, 4);
		}).doesNotThrowAnyException();
		Mockito.verify(scheduleRepository, times(1)).findAllByDateBetweenAndUser(localdate1, localdate6, user);
	}


	@Test
	@DisplayName("일정삭제")
	public void 일정삭제() {

		UserEntity user = UserEntity.builder().id(1L).build();
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		UserPlantEntity userPlant = UserPlantEntity.builder().id(1L).user(user).build();

		LocalDate localdate1 = LocalDate.of(2023, 4, 1);
		ScheduleEntity schedule = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate1)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

		assertThatCode(() -> {
			scheduleService.deleteSchedule(1L);
		}).doesNotThrowAnyException();
		schedule.setIsDeleted(IsDeletedType.Y);
		Mockito.verify(scheduleRepository, times(1)).save(refEq(schedule));

	}


	@Test
	@DisplayName("일정완료")
	public void 일정완료() {

		UserEntity user = UserEntity.builder().id(1L).build();
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		UserPlantEntity userPlant = UserPlantEntity.builder().id(1L).user(user).build();
		LocalDate localdate1 = LocalDate.of(2023, 4, 1);
		ScheduleEntity schedule = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate1)
			.isCompleted(IsCompletedType.N)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

		schedule.setIsCompleted(IsCompletedType.Y);

		assertThatCode(() -> {
			scheduleService.completeSchedule(1L);
		}).doesNotThrowAnyException();
		Mockito.verify(scheduleRepository, times(1)).save(refEq(schedule));

	}


	@Test
	@DisplayName("일정완료취소")
	public void 일정완료취소() {

		UserEntity user = UserEntity.builder().id(1L).build();
		when(authService.getUserId()).thenReturn(1L);
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		UserPlantEntity userPlant = UserPlantEntity.builder().id(1L).user(user).build();
		LocalDate localdate1 = LocalDate.of(2023, 4, 1);
		ScheduleEntity schedule = ScheduleEntity.builder()
			.content("content")
			.userPlant(userPlant)
			.user(user)
			.date(localdate1)
			.isCompleted(IsCompletedType.Y)
			.isDeleted(IsDeletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.build();
		when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

		schedule.setIsCompleted(IsCompletedType.N);

		assertThatCode(() -> {
			scheduleService.incompleteSchedule(1L);
		}).doesNotThrowAnyException();
		Mockito.verify(scheduleRepository, times(1)).save(refEq(schedule));

	}

}
