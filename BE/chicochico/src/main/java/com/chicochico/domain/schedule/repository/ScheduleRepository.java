package com.chicochico.domain.schedule.repository;


import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {

	Optional<ScheduleEntity> findById(Long scheduleId);
	List<ScheduleEntity> findAllByDateBetweenAndUser(LocalDate localDateSt, LocalDate localDateEd, UserEntity user);
	List<ScheduleEntity> findAllByRegularScheduleIdAndDateAfter(Long regularId, LocalDate date);
	List<ScheduleEntity> deleteAllByUser(UserEntity user);

}
