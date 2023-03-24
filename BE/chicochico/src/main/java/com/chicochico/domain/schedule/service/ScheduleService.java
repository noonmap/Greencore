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

import javax.transaction.Transactional;
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
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//year+month=>localdate
		//해당 월의 첫날부터 끝날까지 (between의 경우 마지막은 포함 안됨)
		//1일부터 해당 월에 있는 날만큼 더하면 됨
		LocalDate localdateSt = LocalDate.of(year, month, 1);
		LocalDate localdateEd = localdateSt.plusDays(localdateSt.lengthOfMonth());

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
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//year+month=>localdate
		//해당 요일부터 다다다음날까지 일정보여줌(between의 경우 마지막은 포함 안됨)
		LocalDate localdateSt = LocalDate.of(year, month, day);
		LocalDate localdateEd = localdateSt.plusDays(3);

		List<ScheduleEntity> scheduleList = scheduleRepository.findAllByDateBetweenAndUser(localdateSt, localdateEd, user);
		return scheduleList;
	}


	/**
	 * 일정을 생성합니다.
	 *
	 * @param scheduleRequestDto
	 */
	public void createSchedule(ScheduleRequestDto scheduleRequestDto) {
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		//사용자가 키우는 식물 중 하나
		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//일정 등록
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
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		//사용자가 키우고 있는 식물 중 하나
		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우 && 삭제되지 않은 경우
		if (user.equals(scheduleEntity.getUser()) && scheduleEntity.getIsDeleted().equals(IsDeletedType.N)) {
			ScheduleEntity schedule = ScheduleEntity.builder()
				.id(scheduleId)
				.userPlant(userPlant)
				.user(user)
				.scheduleCode(scheduleRequestDto.getScheduleCode())
				.content(scheduleRequestDto.getContent())
				.date(scheduleRequestDto.getScheduleDate())
				.isDeleted(scheduleEntity.getIsDeleted())
				.isCompleted(scheduleEntity.getIsCompleted())
				.build();
			//수정본 저장
			scheduleRepository.save(schedule);
		} else {
			//access 불가 오류
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
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우 && 삭제되지 않은 경우
		if (user.equals(schedule.getUser()) && schedule.getIsDeleted().equals(IsDeletedType.N)) {
			//삭제로 상태 변경
			schedule.setIsDeleted(IsDeletedType.Y);
			scheduleRepository.save(schedule);
		} else {
			//access 불가 오류
			throw new CustomException(ErrorCode.NO_ACCESS);
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
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우 && 삭제되지 않은 경우
		if (user.equals(schedule.getUser()) && schedule.getIsDeleted().equals(IsDeletedType.N)) {
			//일정 완료로 상태 변경
			schedule.setIsCompleted(IsCompletedType.Y);
			scheduleRepository.save(schedule);
		} else {
			//access 불가 오류
			throw new CustomException(ErrorCode.NO_ACCESS);
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
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우 && 삭제되지 않은 경우
		if (user.equals(schedule.getUser()) && schedule.getIsDeleted().equals(IsDeletedType.N)) {
			// 일정 완료 취소로 상태 변경
			schedule.setIsCompleted(IsCompletedType.N);
			scheduleRepository.save(schedule);
		} else {
			//access 불가 오류
			throw new CustomException(ErrorCode.NO_ACCESS);
		}
	}


	/**
	 * 로그인한 유저의 모든 스케줄 목록을 삭제
	 */
	@Transactional
	public void deleteAllSchedulesByUser(UserEntity user) {
		List<ScheduleEntity> schedules = scheduleRepository.findByUserAndIsDeleted(user, IsDeletedType.N);
		for (ScheduleEntity schedule : schedules) {
			schedule.setIsDeleted(IsDeletedType.Y);
		}
		scheduleRepository.saveAll(schedules);
	}

}
