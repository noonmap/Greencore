package com.chicochico.domain.schedule.entity;


import com.chicochico.common.code.RegularScheduleType;
import com.chicochico.common.code.ScheduleType;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "regular_schedule") // snake_case로 설정
public class RegularScheduleEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private RegularScheduleType regularScheduleCode;

	@Column(nullable = false)
	private Integer day;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	private String content;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private ScheduleType scheduleCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_plant_id", nullable = false)
	private UserPlantEntity userPlant;

	@Column
	private LocalDate lastDate;


	public void setLastDate(LocalDate lastDate) {
		this.lastDate = lastDate;
	}

}
