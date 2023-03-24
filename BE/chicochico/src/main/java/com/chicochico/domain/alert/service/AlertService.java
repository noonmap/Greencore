package com.chicochico.domain.alert.service;


import com.chicochico.common.service.AuthService;
import com.chicochico.domain.alert.entity.AlertEntity;
import com.chicochico.domain.alert.repository.AlertRepository;
import com.chicochico.domain.user.entity.UserEntity;
import com.chicochico.domain.user.repository.UserRepository;
import com.chicochico.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

import static com.chicochico.exception.ErrorCode.ACCESS_TOKEN_NOT_FOUND;
import static com.chicochico.exception.ErrorCode.ALERT_NOT_FOUND;


@Service
@RequiredArgsConstructor
public class AlertService {

	private final AlertRepository alertRepository;
	private final UserRepository userRepository;
	private final AuthService authService;


	/**
	 * 유저 본인의 알림 목록을 조회합니다.
	 *
	 * @return
	 */
	public List<AlertEntity> getAlertList(Pageable pageable) {
		Long userId = authService.getUserId();
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ACCESS_TOKEN_NOT_FOUND));

		List<AlertEntity> alertList = alertRepository.findAllByUserId(userId, pageable);

		return alertList;
	}


	/**
	 * 해당 알림을 삭제합니다.
	 *
	 * @param alertId
	 */
	public void deleteAlert(Long alertId) {
		AlertEntity alert = alertRepository.findById(alertId).orElseThrow(() -> new CustomException(ALERT_NOT_FOUND));
		alertRepository.delete(alert);
	}


	/**
	 * 해당 유저의 알림을 모두 삭제합니다.
	 *
	 * @param userId 유저 Id
	 */
	@Transactional
	public void deleteAllAlertsByUserId(Long userId) {
		alertRepository.deleteByUserId(userId);
	}

}
