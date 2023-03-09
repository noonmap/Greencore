package com.chicochico.domain.schedule.repository;


import com.chicochico.domain.schedule.entity.ScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {
}
