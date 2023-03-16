package com.chicochico.domain.schedule.service;


import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.schedule.dto.request.ScheduleRequestDto;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.schedule.repository.ScheduleRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ScheduleService {

	private final ScheduleRepository scheduleRepository;
	private final UserRepository userRepository;
	private final UserPlantRepository userPlantRepository;
	private final AuthService authService;


	/**
	 * 월별 일정 목록을 조회합니다.
	 *
	 * @param year
	 * @param month
	 * @return
	 */
	public List<ScheduleEntity> getMonthSchedule(Integer year, Integer month) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		//year+month=>localdate?
		LocalDate localdateSt = LocalDate.of(year, month, 1);
		LocalDate localdateEd = LocalDate.of(year, month, localdateSt.lengthOfMonth());

		List<ScheduleEntity> scheduleList = scheduleRepository.findAllByUserAndBetweenDateAndDate(user, localdateSt, localdateEd);
		return scheduleList;
	}


	/**
	 * 주별 일정 목록을 조회합니다.
	 *
	 * @param year
	 * @param month
	 * @param day
	 * @return
	 */
	public List<ScheduleEntity> getWeekSchedule(Integer year, Integer month, Integer day) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		LocalDate localdateSt = LocalDate.of(year, month, day);
		LocalDate localdateEd = localdateSt.plusDays(7);

		List<ScheduleEntity> scheduleList = scheduleRepository.findAllByUserAndBetweenDateAndDate(user, localdateSt, localdateEd);
		return scheduleList;
	}


	/**
	 * @param scheduleRequestDto
	 */
	public void createSchedule(ScheduleRequestDto scheduleRequestDto) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		scheduleRepository.save(scheduleRequestDto.toEntity(userPlant, user));
	}


	/**
	 * @param scheduleId
	 * @param scheduleRequestDto
	 */
	public void modifySchedule(Long scheduleId, ScheduleRequestDto scheduleRequestDto) {
		ScheduleEntity scheduleEntity = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(scheduleEntity.getUser())) {
			ScheduleEntity.builder()
				.id(scheduleId)
				.userPlant(userPlant)
				.user(user)
				.scheduleCode(scheduleRequestDto.getScheduleCode())
				.content(scheduleRequestDto.getContent())
				.date(scheduleRequestDto.getScheduleDate())
				.isCompleted(scheduleEntity.getIsCompleted())
				.build();
		} else {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

	}


	/**
	 * @param scheduleId
	 */
	public void deleteSchedule(Long scheduleId) {
		ScheduleEntity scheduleEntity = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(scheduleEntity.getUser())) {
			scheduleEntity.setIsDeleted(IsDeletedType.Y);
		}

	}


	/**
	 * @param scheduleId
	 */
	public void completeSchedule(Long scheduleId) {
		ScheduleEntity scheduleEntity = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(scheduleEntity.getUser()) && scheduleEntity.getIsDeleted().equals(IsDeletedType.N)) {
			scheduleEntity.setIsCompleted(true);
		}
	}


	/**
	 * @param scheduleId
	 */
	public void incompleteSchedule(Long scheduleId) {
		ScheduleEntity scheduleEntity = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(scheduleEntity.getUser()) && scheduleEntity.getIsDeleted().equals(IsDeletedType.N)) {
			scheduleEntity.setIsCompleted(false);
		}
	}

}
