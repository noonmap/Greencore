package com.chicochico.domain.alert.repository;


import com.chicochico.domain.alert.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AlertRepository extends JpaRepository<AlertEntity, Long> {
}
