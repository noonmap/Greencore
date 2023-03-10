package com.chicochico.domain.plant.repository;


import com.chicochico.domain.plant.entity.PlantEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PlantRepository extends JpaRepository<PlantEntity, Long> {
}
