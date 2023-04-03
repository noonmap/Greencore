package com.chicochico.domain.schedule.service;


import com.chicochico.common.code.IsCompletedType;
import com.chicochico.common.code.IsDeletedType;
import com.chicochico.common.code.RegularScheduleType;
import com.chicochico.common.service.AuthService;
import com.chicochico.domain.schedule.dto.request.ScheduleRequestDto;
import com.chicochico.domain.schedule.entity.RegularScheduleEntity;
import com.chicochico.domain.schedule.entity.ScheduleEntity;
import com.chicochico.domain.schedule.repository.RegularScheduleRepository;
import com.chicochico.domain.schedule.repository.ScheduleRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.entity.UserPlantEntity;
import com.chicochico.domain.user.repository.UserPlantRepository;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import com.chicochico.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ScheduleService {

	private final ScheduleRepository scheduleRepository;
	private final UserRepository userRepository;
	private final UserPlantRepository userPlantRepository;
	private final RegularScheduleRepository regularScheduleRepository;
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
		LocalDate localdateEd = LocalDate.of(year, month, localdateSt.lengthOfMonth());

		List<ScheduleEntity> scheduleList = scheduleRepository.findAllByDateBetweenAndUserOrderByDate(localdateSt, localdateEd, user);

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

		List<ScheduleEntity> scheduleList = scheduleRepository.findAllByDateBetweenAndUserOrderByDate(localdateSt, localdateEd, user);
		return scheduleList;

	}


	/**
	 * 일정을 생성합니다.
	 *
	 * @param scheduleRequestDto
	 */
	@Transactional
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
	@Transactional
	public void modifySchedule(Long scheduleId, ScheduleRequestDto scheduleRequestDto) {
		ScheduleEntity scheduleEntity = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		//사용자가 키우고 있는 식물 중 하나
		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우
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
	@Transactional
	public void deleteSchedule(Long scheduleId) {
		ScheduleEntity schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우 && 삭제되지 않은 경우
		if (user.equals(schedule.getUser())) {
			//삭제하기
			scheduleRepository.delete(schedule);
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
	@Transactional
	public void completeSchedule(Long scheduleId) {
		ScheduleEntity schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우
		if (user.equals(schedule.getUser())) {
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
	@Transactional
	public void incompleteSchedule(Long scheduleId) {
		ScheduleEntity schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당 일정의 작성자와 현재 로그인 돼있는 사용자가 같을 경우
		if (user.equals(schedule.getUser())) {
			// 일정 완료 취소로 상태 변경
			schedule.setIsCompleted(IsCompletedType.N);
			scheduleRepository.save(schedule);
		} else {
			//access 불가 오류
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

	}


	/**
	 * 주간 정기 일정을 등록할 때 호출합니다.
	 *
	 * @param scheduleRequestDto
	 */
	@Transactional
	public void createWeeklySchedule(ScheduleRequestDto scheduleRequestDto) {
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		LocalDate now = LocalDate.now();

		//정기 일정 등록
		RegularScheduleEntity regularSchedule = scheduleRequestDto.toEntity(user, userPlant, now);
		regularScheduleRepository.save(regularSchedule);

		//그달 마지막 날
		LocalDate date = LocalDate.of(now.getYear(), now.getMonth(), now.lengthOfMonth());

		//정기 일정에 포함된 일정들 한 해 동안 등록
		createWeeklySchedule(scheduleRequestDto, user, regularSchedule, date);

	}


	/**
	 * 월간 정기 일정을 등록할 때 호출합니다.
	 *
	 * @param scheduleRequestDto
	 */
	@Transactional
	public void createMonthlySchedule(ScheduleRequestDto scheduleRequestDto) {
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		LocalDate now = LocalDate.now();

		//정기 일정 등록
		RegularScheduleEntity regularSchedule = scheduleRequestDto.toEntity(user, userPlant, now);
		regularScheduleRepository.save(regularSchedule);

		//그달 마지막 날
		LocalDate date = LocalDate.of(now.getYear(), now.getMonth(), now.lengthOfMonth());

		createMonthlySchedule(scheduleRequestDto, user, regularSchedule, date);

	}


	/**
	 * 달력이 넘어가면 자동으로 정기 일정 생성합니다.
	 *
	 * @param date
	 */
	public void createRegularSchedule(LocalDate date) {
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		//해당월 마지막 날
		LocalDate lastDate = LocalDate.of(date.getYear(), date.getMonth(), date.lengthOfMonth());

		//현재 달력기준의 날짜에 만들어지지 않은 모든 정기 일정을 조회
		List<RegularScheduleEntity> regularScheduleList = regularScheduleRepository.findAllByUserAndLastDateBefore(user, date);

		//각 일정들에 대한 로직 처리
		for (RegularScheduleEntity regularSchedule : regularScheduleList) {

			ScheduleRequestDto scheduleRequestDto = ScheduleRequestDto.builder()
				.regularScheduleCode(regularSchedule.getRegularScheduleCode())
				.day(regularSchedule.getDay())
				.content(regularSchedule.getContent())
				.userPlantId(regularSchedule.getUserPlant().getId())
				.scheduleCode(regularSchedule.getScheduleCode())
				.build();

			//주 단위 정기 일정
			if (regularSchedule.getRegularScheduleCode().equals(RegularScheduleType.WEEKLY_SCHEDULE)) {
				createWeeklySchedule(scheduleRequestDto, user, regularSchedule, lastDate);
			}
			//월 단위 정기 일정
			else if (regularSchedule.getRegularScheduleCode().equals(RegularScheduleType.MONTHLY_SCHEDULE)) {
				createMonthlySchedule(scheduleRequestDto, user, regularSchedule, lastDate);
			}
		}

	}


	/**
	 * 월간 정기 일정을 등록합니다.
	 *
	 * @param scheduleRequestDto
	 * @param user
	 * @param lastDate           그 달 마지막 날
	 */
	@Transactional
	public void createMonthlySchedule(ScheduleRequestDto scheduleRequestDto, UserEntity user, RegularScheduleEntity regularSchedule, LocalDate lastDate) {
		//마지막으로 생성된 정기일정 날짜
		LocalDate dateSt = regularSchedule.getLastDate();

		//처음 다음의 정기 일정을 만들려면
		if (dateSt.getDayOfMonth() != dateSt.lengthOfMonth() && dateSt.getDayOfMonth() == scheduleRequestDto.getDay()) {
			ScheduleEntity schedule = scheduleRequestDto.toEntity(user, regularSchedule, dateSt);
			scheduleRepository.save(schedule);
			dateSt = LocalDate.of(dateSt.getYear(), dateSt.getMonth(), dateSt.lengthOfMonth());
			regularSchedule.setLastDate(dateSt);
			regularScheduleRepository.save(regularSchedule);

		}

		Integer nowDay = dateSt.getDayOfMonth();

		Integer day = scheduleRequestDto.getDay();

		//마지막 등록부터 현재 달까지 주기적 일정 등록
		for (LocalDate date = dateSt.plusDays(1); date.isBefore(lastDate); date = date.plusMonths(1)) {
			//마지막 날마다 schedule 등록
			if (day >= date.lengthOfMonth()) {
				LocalDate newDate = LocalDate.of(date.getYear(), date.getMonth(), date.lengthOfMonth());

				ScheduleEntity schedule = scheduleRequestDto.toEntity(user, regularSchedule, newDate);
				scheduleRepository.save(schedule);
			}
			//매달 해당 일마다 schedule 등록
			else {
				if (date.isAfter(LocalDate.now())) {
					LocalDate newDate = LocalDate.of(date.getYear(), date.getMonth(), day);

					ScheduleEntity schedule = scheduleRequestDto.toEntity(user, regularSchedule, newDate);
					scheduleRepository.save(schedule);
				}
			}
		}
		//마지막 데이트 갱신
		if (dateSt.isBefore(lastDate)) {
			regularSchedule.setLastDate(lastDate);
			regularScheduleRepository.save(regularSchedule);
		}

	}


	/**
	 * 주간 정기 일정을 등록합니다.
	 *
	 * @param scheduleRequestDto
	 * @param user
	 * @param regularSchedule
	 */
	@Transactional
	public void createWeeklySchedule(ScheduleRequestDto scheduleRequestDto, UserEntity user, RegularScheduleEntity regularSchedule, LocalDate lastDate) {
		//월 화 수 목 금 토 일 : 1 2 3 4 5 6 7

		//마지막으로 생성된 정기일정 날짜
		LocalDate nowDate = regularSchedule.getLastDate();
		//요일
		Integer day = scheduleRequestDto.getDay();

		//시작 날 찾기
		LocalDate dateSt = nowDate;
		for (int d = 1; d <= 7; d++) {
			dateSt = nowDate.plusDays(d);
			Integer dayOfWeek = dateSt.getDayOfWeek().getValue();
			if (dayOfWeek == day) {
				break;
			}
		}

		//매주마다 스케줄 등록
		for (LocalDate date = dateSt; date.isBefore(lastDate); date = date.plusDays(7)) {
			ScheduleEntity schedule = scheduleRequestDto.toEntity(user, regularSchedule, date);
			scheduleRepository.save(schedule);

			//마지막 등록 날
			regularSchedule.setLastDate(date);
			regularScheduleRepository.save(regularSchedule);
		}

	}


	/**
	 * 정기 일정을 수정합니다.
	 *
	 * @param regularId
	 * @param scheduleRequestDto
	 */
	@Transactional
	public void modifyRegularSchedule(Long regularId, ScheduleRequestDto scheduleRequestDto) {
		//오늘
		LocalDate date = LocalDate.now();
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		//정기 일정 조회
		RegularScheduleEntity regularSchedule = regularScheduleRepository.findById(regularId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		//정기 일정 만든 유저와 현재 유저 동일&&삭제되지 않은 정기 일정
		if (user.equals(regularSchedule.getUser())) {
			//userPlant 찾기
			UserPlantEntity userPlant = userPlantRepository.findById(scheduleRequestDto.getUserPlantId()).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

			//있던 거 삭제
			//정기 일정이랑 정기 일정에 속한 일정들 삭제
			deleteSchedulesOfRegularSchedule(regularId);

			//수정본 저장
			RegularScheduleEntity regularSchedule1 = scheduleRequestDto.toEntity(regularId, user, userPlant, date);
			regularScheduleRepository.save(regularSchedule1);

			//새로 등록할 정기 일정 타입
			RegularScheduleType regularScheduleType = scheduleRequestDto.getRegularScheduleCode();

			//바뀐 정기 일정이 주간 정기 일정일 때
			if (regularScheduleType.equals(RegularScheduleType.WEEKLY_SCHEDULE)) {
				createWeeklySchedule(scheduleRequestDto, user, regularSchedule1, date);
			}
			//바뀐 정기 일정이 월간 정기 일정일 때
			else if (regularScheduleType.equals(RegularScheduleType.MONTHLY_SCHEDULE)) {
				createMonthlySchedule(scheduleRequestDto, user, regularSchedule1, date);
			}
		}

	}


	/**
	 * 정기 일정 삭제합니다.
	 *
	 * @param regularId
	 */
	@Transactional
	public void deleteRegularSchedule(Long regularId) {
		RegularScheduleEntity regularSchedule = regularScheduleRepository.findById(regularId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));
		//정기 일정에 속한 일정을 현재 이후로 삭제
		deleteSchedulesOfRegularSchedule(regularId);
		//정기 일정 삭제
		regularSchedule.setIsDeleted(IsDeletedType.Y);
		regularScheduleRepository.save(regularSchedule);

	}


	/**
	 * 정기 일정에 속한 일정을 현재 이후로 삭제합니다.
	 *
	 * @param regularId
	 */
	@Transactional
	public void deleteSchedulesOfRegularSchedule(Long regularId) {
		//오늘
		LocalDate date = LocalDate.now();
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		//정기 일정 조회
		RegularScheduleEntity regularSchedule = regularScheduleRepository.findById(regularId).orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND));

		//정기 일정 만든 유저와 현재 유저 동일
		if (user.equals(regularSchedule.getUser())) {
			//삭제 되지 않은 정기 일정에 포함된 오늘 이후 일정들
			List<ScheduleEntity> scheduleList = scheduleRepository.findAllByRegularScheduleIdAndDateAfter(regularId, date);

			for (ScheduleEntity schedule : scheduleList) {
				//정기 일정 내의 일정 삭제
				scheduleRepository.delete(schedule);
			}
		} else {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

	}


	/**
	 * 로그인한 유저의 모든 스케줄 목록을 삭제
	 */
	@Transactional
	public void deleteAllSchedulesByUser(UserEntity user) {
		scheduleRepository.deleteAllByUserAndDateAfter(user, LocalDate.now());

	}


	/**
	 * 내키식 삭제할 때 관련된 모든 스케줄(앞으로 있을) 삭제
	 *
	 * @param userPlant
	 */
	@Transactional
	public void deleteAllSchedulesByUserPlant(UserPlantEntity userPlant) {
		scheduleRepository.deleteAllByUserPlantAndDateAfter(userPlant, LocalDate.now());
	}


	/**
	 * 사용자가 등록한 정기 일정 목록을 반환
	 *
	 * @return
	 */
	public List<RegularScheduleEntity> getRegularScheduleList() {
		//현재 로그인 돼있는 사용자
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		return regularScheduleRepository.findAllByUserAndIsDeleted(user, IsDeletedType.N);
	}

}
