import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { deleteUserPlant } from '@/core/user/userAPI';
import UserPlantModal from '@/components/modal/UserPlantModal';
import AppModal from './common/AppModal';
import styles from '@/styles/user/feed.module.scss';

import Skeleton from 'react-loading-skeleton';
import { useAppSelector } from '@/core/hooks';

export default function UserFeedPlantListItem({ userPlant, fetchUserPlantList }) {
	const popUpRef = useRef<HTMLDivElement>(null);
	const isSameUser = useAppSelector((state) => state.user.isSameUser);

	const [userPlantId, setUserPlantId] = useState(null);
	const [userPlantNickname, setUserPlantNickname] = useState('');
	const [isEditPopUp, setIsEditPopUp] = useState(false);

	const [isOpenUserPlantUpdateModal, setIsOpenUserPlantUpdateModal] = useState(false);
	const [isOpenUserPlantDeleteModal, setIsOpenUserPlantDeleteModal] = useState(false);

	useEffect(() => {
		document.addEventListener('mousedown', handleModalOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleModalOutsideClick);
		};
	}, []);

	/** 팝업 바깥 클릭 시 */
	function handleModalOutsideClick(e) {
		if (popUpRef.current && !popUpRef.current.contains(e.target)) setIsEditPopUp(false);
	}

	/** 키우는 식물 수정 모달 열기 함수 */
	function handleIsOpenUserPlantNicknameUpdate(userPlantId: number, plantNickname: string) {
		setUserPlantId(userPlantId);
		setUserPlantNickname(plantNickname);
		setIsOpenUserPlantUpdateModal(true);
		setIsEditPopUp(false);
	}

	/** 키우는 식물 삭제 모달 열기 함수 */
	function handleIsOpenUserPlantDelete(userPlantId: number) {
		setUserPlantId(userPlantId);
		setIsOpenUserPlantDeleteModal(true);
		setIsEditPopUp(false);
	}

	/** 키우는 식물 삭제 함수 */
	async function handleUserPlantDelete() {
		try {
			const { data } = await deleteUserPlant(userPlantId);
			setIsOpenUserPlantDeleteModal(false);
			fetchUserPlantList();
		} catch (error) {
			console.error(error);
			setIsOpenUserPlantDeleteModal(false);
		}
	}

	/** 수정/삭제 팝업 띄우는 함수 */
	function handleisEditToggle() {
		setIsEditPopUp(!isEditPopUp);
	}

	return (
		<>
			{/* 키우는 식물 수정 모달 */}
			<UserPlantModal
				isOpen={isOpenUserPlantUpdateModal}
				update
				userPlantId={userPlantId}
				userPlantNickname={userPlantNickname}
				title={'키우는 식물 정보 수정'}
				handleModalClose={() => setIsOpenUserPlantUpdateModal(false)}
				fetchUserPlantList={fetchUserPlantList}
			/>

			{/* 키우는 식물 삭제 모달 */}
			<AppModal
				isOpen={isOpenUserPlantDeleteModal}
				title="삭제"
				handleModalClose={() => setIsOpenUserPlantDeleteModal(false)}
				handleModalConfirm={handleUserPlantDelete}
			/>

			<div key={userPlant.userPlantId} className="">
				<div className="relative">
					<div className="flex flex-col items-center rounded-full" style={{ width: '80px', height: '80px' }}>
						{userPlant ? (
							<Image
								src={userPlant.plantImagePath}
								alt="사용자 식물"
								width={80}
								height={80}
								style={{ width: '80px', height: '80px', boxShadow: 'var(--box-shadow-card)' }}
								className="rounded-full "
							/>
						) : (
							<Skeleton width={80} height={80} circle />
						)}
						<div className="text-xs mt-1">{userPlant.plantNickname}</div>

						<div className="flex justify-start items-center w-24">
							{isSameUser ? (
								<span
									className="material-symbols-outlined md cursor-pointer absolute top-1 -left-4"
									style={{ fontSize: '1.3rem' }}
									onClick={handleisEditToggle}>
									more_vert
								</span>
							) : null}
						</div>
					</div>
				</div>

				{isEditPopUp ? (
					<div className="relative" ref={popUpRef}>
						<div className={`${styles.popUp}`}>
							<div onClick={() => handleIsOpenUserPlantNicknameUpdate(userPlant.userPlantId, userPlant.plantNickname)}>수정</div>
							<div onClick={() => handleIsOpenUserPlantDelete(userPlant.userPlantId)}>삭제</div>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}
