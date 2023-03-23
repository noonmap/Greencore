package com.chicochico.schedule;


import com.chicochico.common.code.IsCompletedType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.plant.entity.PlantEntity;
import com.chicochico.domain.plant.repository.PlantRepository;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.schedule.repository.ScheduleRepository;
import com.chicochico.domain.schedule.service.ScheduleService;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;


@DataJpaTest
@ActiveProfiles("test")
public class ScheduleRepositoryTest {

	@Mock
	AuthService authService;
	@Mock
	ScheduleService scheduleService;

	@Autowired
	ScheduleRepository scheduleRepository;
	@Autowired
	UserRepository userRepository;
	@Autowired
	UserPlantRepository userPlantRepository;
	@Autowired
	PlantRepository plantRepository;


	@Test
	@DisplayName("Schedule Repository 테스트")
	public void 일정목록조회테스트() {
		UserEntity user = userRepository.save(UserEntity.builder()
			.id(1L).email("email")
			.password("password")
			.nickname("nickname")
			.profileImagePath("path")
			.introduction("intro")
			.followingCount(0)
			.followerCount(0)
			.isDeleted(IsDeletedType.N).build());

		PlantEntity plant = plantRepository.save(PlantEntity.builder()
			.name("name")
			.imagePath("default")
			.userCount(0).build());
		UserPlantEntity userPlant = userPlantRepository.save(UserPlantEntity.builder()
			.id(1L)
			.user(user)
			.plant(plant)
			.plantNickname("nickname")
			.plantImagePath("default")
			.isDeleted(IsDeletedType.N).build());

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

		List<ScheduleEntity> scheduleEntityListMonth = scheduleRepository.findAllByDateBetweenAndUser(localdate1, localdate6, user);
		List<ScheduleEntity> scheduleEntityListWeek = scheduleRepository.findAllByDateBetweenAndUser(localdate1, localdate7, user);

		Assertions.assertTrue(scheduleEntityListMonth.size() == 4);
		Assertions.assertTrue(scheduleEntityListWeek.size() == 2);

	}

}
