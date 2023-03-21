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
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
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

	private UserEntity userEntity;
	private PlantEntity plantEntity;
	private UserPlantEntity userPlantEntity;
	private ScheduleEntity scheduleEntity;


	@BeforeEach
	public void init() {
		LocalDate localdate1 = LocalDate.of(2023, 4, 1);
		LocalDate localdate2 = LocalDate.of(2023, 4, 3);
		LocalDate localdate3 = LocalDate.of(2023, 4, 7);
		LocalDate localdate4 = LocalDate.of(2023, 4, 21);
		LocalDate localdate5 = LocalDate.of(2023, 5, 2);
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

		plantEntity = plantRepository.save(PlantEntity.builder()
			.name("tomato")
			.build());

		userPlantEntity = userPlantRepository.save(UserPlantEntity.builder()
			.user(userEntity)
			.plant(plantEntity)
			.plantNickname("cute tomato")
			.plantImagePath("path")
			.isDeleted(IsDeletedType.N)
			.build());

		scheduleEntity = scheduleRepository.save(ScheduleEntity.builder()
			.content("content")
			.date(localdate1)
			.isDeleted(IsDeletedType.N)
			.isCompleted(IsCompletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.user(userEntity)
			.userPlant(userPlantEntity)
			.build());
		scheduleEntity = scheduleRepository.save(ScheduleEntity.builder()
			.content("content")
			.date(localdate2)
			.isDeleted(IsDeletedType.N)
			.isCompleted(IsCompletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.user(userEntity)
			.userPlant(userPlantEntity)
			.build());
		scheduleEntity = scheduleRepository.save(ScheduleEntity.builder()
			.content("content")
			.date(localdate3)
			.isDeleted(IsDeletedType.N)
			.isCompleted(IsCompletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.user(userEntity)
			.userPlant(userPlantEntity)
			.build());
		scheduleEntity = scheduleRepository.save(ScheduleEntity.builder()
			.content("content")
			.date(localdate4)
			.isDeleted(IsDeletedType.N)
			.isCompleted(IsCompletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.user(userEntity)
			.userPlant(userPlantEntity)
			.build());
		scheduleEntity = scheduleRepository.save(ScheduleEntity.builder()
			.content("content")
			.date(localdate5)
			.isDeleted(IsDeletedType.N)
			.isCompleted(IsCompletedType.N)
			.scheduleCode(ScheduleType.SCHEDULE_PRUNING)
			.user(userEntity)
			.userPlant(userPlantEntity)
			.build());
	}


	@Test
	@DisplayName("Schedule Repository 테스트")
	public void 일정목록조회테스트() {
		LocalDate localdateSt = LocalDate.of(2023, 4, 1);
		LocalDate localdateEd = LocalDate.of(2023, 4, 30);
		LocalDate localdateEd1 = LocalDate.of(2023, 4, 8);
		List<ScheduleEntity> scheduleEntityListMonth = scheduleRepository.findAllByDateBetweenAndUser(localdateSt, localdateEd, userEntity);
		List<ScheduleEntity> scheduleEntityListWeek = scheduleRepository.findAllByDateBetweenAndUser(localdateSt, localdateEd1, userEntity);

		Assertions.assertThat(scheduleEntityListMonth.size() == 4);
		Assertions.assertThat(scheduleEntityListWeek.size() == 2);

	}
	
}
