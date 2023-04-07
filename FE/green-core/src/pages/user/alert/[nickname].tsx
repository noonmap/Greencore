import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { createAlert, deleteSelectedAlert, getAlertList, updateAllAlert, updateSelectedAlert, checkIsAlert } from '@/core/alert/alertAPI';
import AppLoading from '@/components/common/AppLoading';
import UserAlertListItem from '@/components/UserAlertListItem';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import styles from '@/styles/user/alert.module.scss';

export default function Alert() {
	const dispatch = useAppDispatch();
	const nickname = useAppSelector((state) => state.common?.userInfo?.nickname);

	const isLoading = useAppSelector((state) => state.alert.isLoading);
	const alertList = useAppSelector((state) => state.alert.alertList);
	const page = useAppSelector((state) => state.alert.page);
	const size = useAppSelector((state) => state.alert.size);

	const [selectedAlertList, setSelectedAlertList] = useState<Array<string>>([]);

	// searchState 변경
	useEffect(() => {
		dispatch(SET_IS_SEARCH_STATE('default'));
	});

	useEffect(() => {
		fetchAlertList();
		return () => {};
	}, []);

	/** 알림 리스트 가져오는 함수 */
	async function fetchAlertList() {
		const payload = { nickname, page, size };
		dispatch(getAlertList(payload));
	}

	/** 알림 읽음 확인 함수 */
	async function handleSelectedAlertRead() {
		try {
			const payload = { nickname, selectedAlertList };
			dispatch(updateSelectedAlert(payload));
			dispatch(checkIsAlert(nickname));
		} catch (error) {
			console.error(error);
		}
	}

	/** 알림 전체 읽음 확인 함수 */
	async function handleAllAlertRead() {
		try {
			dispatch(updateAllAlert(nickname));
		} catch (error) {
			console.error(error);
		}
	}

	/** 알림 리스트 선택 삭제 함수 */
	async function handleSelectedAlertDelete() {
		try {
			const payload = { nickname, selectedAlertList };
			dispatch(deleteSelectedAlert(payload));
		} catch (error) {
			console.error(error);
		}
	}

	/** 알림 생성 함수 */
	async function handleAlertCreate() {
		try {
			const payload = {
				nickname,
				mentionNickname: 'hi',
				type: 'ALERT_FOLLOW',
				urlPath: '/',
				createdAt: '2',
				isRead: false
			};
			dispatch(createAlert(payload));
		} catch (error) {
			console.error(error);
		}
	}

	/** 알림 체크하기 기능 */
	async function handleIsAlertCheck() {
		try {
			dispatch(checkIsAlert(nickname));
		} catch (error) {
			console.error(error);
		}
	}

	if (isLoading)
		return (
			<AppLayout>
				<AppLoading />
			</AppLayout>
		);

	return (
		<AppLayout>
			{alertList.length == 0 ? (
				<div className="space-y-2 px-4 py-4">
					<h1 className={`${styles.title} main mb-10`}>알림</h1>

					<div className="text-center flex items-center justify-center space-x-2 pt-40">
						<div className="font-italic">현재 조회되는 알림이 없습니다</div>
						<img src="/images/emoji/face_with_rolling_eyes.png" width="24" height="24" />
					</div>
				</div>
			) : (
				<div className="space-y-2 px-4 py-4">
					<h1 className={`${styles.title} main mb-10`}>알림</h1>

					<div className="flex justify-between mx-7 ">
						<div className="flex space-x-2 mb-2">
							<div
								className="flex items-center cursor-pointer rounded-full p-0.5"
								onClick={handleAllAlertRead}
								style={{ backgroundColor: 'var(--main-color)' }}>
								<span className="material-symbols-outlined font-bold text-white" style={{ fontSize: '1.2rem', backgroundColor: 'var(--main-color)' }}>
									done
								</span>
								<div className="pr-1 font-bold text-white" style={{ fontSize: '0.8rem' }}>
									전체 읽음 확인
								</div>
							</div>

							<div
								className="flex items-center cursor-pointer rounded-full p-0.5"
								onClick={handleSelectedAlertRead}
								style={{ backgroundColor: 'var(--main-color)' }}>
								<span className="material-symbols-outlined font-bold text-white" style={{ fontSize: '1.2rem' }}>
									done
								</span>
								<div className="pr-1 font-bold text-white" style={{ fontSize: '0.8rem' }}>
									읽음 확인
								</div>
							</div>
						</div>

						<div className="flex items-center cursor-pointer rounded-full" onClick={handleSelectedAlertDelete}>
							<span className="material-symbols-outlined font-bold" style={{ fontSize: '1.2rem' }}>
								delete
							</span>
							<div className="pr-1 font-bold text-black" style={{ fontSize: '0.8rem' }}>
								삭제
							</div>
						</div>
					</div>

					<div className="flex flex-col mx-7">
						{alertList.map((alert) => (
							<UserAlertListItem key={alert.alertId} alert={alert} nickname={nickname} selectedAlertList={selectedAlertList} />
						))}
					</div>
				</div>
			)}
		</AppLayout>
	);
}
