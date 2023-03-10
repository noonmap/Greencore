package com.chicochico.domain.alert.service;


import com.chicochico.domain.alert.entity.AlertEntity;
import com.chicochico.domain.alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AlertService {

	private final AlertRepository alertRepository;


	/**
	 * 유저 본인의 알림 목록을 조회합니다.
	 *
	 * @return
	 */
	public List<AlertEntity> getAlertList() {
		return new ArrayList<>();
	}


	/**
	 * 해당 알림을  삭제합니다.
	 *
	 * @param alertId
	 */
	public void deleteAlert(Long alertId) {
		
	}

}
