package com.chicochico.domain.schedule.service;


import com.chicochico.common.code.IsCompletedType;
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

		List<ScheduleEntity> scheduleList = scheduleRepository.findAllByDateBetweenAndUser(localdateSt, localdateEd, user);
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

		List<ScheduleEntity> scheduleList = scheduleRepository.findAllByDateBetweenAndUser(localdateSt, localdateEd, user);
		return scheduleList;
	}


	/**
	 * 일정을 생성합니다.
	 *
	 * @param scheduleRequestDto
	 */
	public void createSchedule(ScheduleRequestDto scheduleRequestDto) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		scheduleRepository.save(scheduleRequestDto.toEntity(userPlant, user));
	}


	/**
	 * 일정을 수정합니다.
	 *
	 * @param scheduleId
	 * @param scheduleRequestDto
	 */
	public void modifySchedule(Long scheduleId, ScheduleRequestDto scheduleRequestDto) {
		ScheduleEntity scheduleEntity = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(scheduleEntity.getUser())) {
			ScheduleEntity schedule = ScheduleEntity.builder()
				.id(scheduleId)
				.userPlant(userPlant)
				.user(user)
				.scheduleCode(scheduleRequestDto.getScheduleCode())
				.content(scheduleRequestDto.getContent())
				.date(scheduleRequestDto.getScheduleDate())
				.isCompleted(scheduleEntity.getIsCompleted())
				.build();
			scheduleRepository.save(schedule);
		} else {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

	}


	/**
	 * 일정을 삭제합니다.
	 *
	 * @param scheduleId
	 */
	public void deleteSchedule(Long scheduleId) {
		ScheduleEntity schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(schedule.getUser())) {
			schedule.setIsDeleted(IsDeletedType.Y);
			scheduleRepository.save(schedule);
		}

	}


	/**
	 * 일정 상태를 완료로 바꿉니다.
	 *
	 * @param scheduleId
	 */
	public void completeSchedule(Long scheduleId) {
		ScheduleEntity schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(schedule.getUser()) && schedule.getIsDeleted().equals(IsDeletedType.N)) {
			schedule.setIsCompleted(IsCompletedType.Y);
			scheduleRepository.save(schedule);
		}
	}


	/**
	 * 일정 상태를 미완료로 바꿉니다.
	 *
	 * @param scheduleId
	 */
	public void incompleteSchedule(Long scheduleId) {
		ScheduleEntity schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		if (user.equals(schedule.getUser()) && schedule.getIsDeleted().equals(IsDeletedType.N)) {
			schedule.setIsCompleted(IsCompletedType.N);
			scheduleRepository.save(schedule);
		}
	}

}
