import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './UserFeedDiary.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/core/hooks';
import { createBookmark, deleteBookmark, deleteDiarySet } from '@/core/diarySet/diarySetAPI';
import DiarySetModal from '@/components/modal/DiarySetModal';
import AppModal from './common/AppModal';

export default function UserFeedDiarySetListItem({ nickname, diarySet, fetchDiarySetList }) {
	const router = useRouter();
	const myNickname = useAppSelector((state) => state.common?.userInfo?.nickname);

	const [isSameUser, setIsSameUser] = useState<boolean>(false);
	const [isEditPopUp, setIsEditPopUp] = useState<boolean>(false);

	const [diarySetId, setDiarySetId] = useState(null);
	const [diarySetList, setDiarySetList] = useState([]);

	const [isOpenDiarySetUpdateModal, setIsOpenDiarySetUpdateModal] = useState(false);
	const [isOpenDiarySetDeleteModal, setIsOpenDiarySetDeleteModal] = useState(false);

	useEffect(() => {
		if (!router.isReady) return;
		if (!router.query.nickname) return;
		checkSameUser();
	}, [nickname]);

	/** url path의 유저와 현재 로그인 유저가 같은지 확인하는 함수 */
	const checkSameUser = useCallback(() => {
		if (myNickname == nickname) setIsSameUser(true);
	}, [myNickname, nickname]);

	async function handleIsOpenDiarySetUpdate() {
		setDiarySetId(diarySet.diarySetId);
		setIsOpenDiarySetUpdateModal(true);
		setIsEditPopUp(false);
	}

	async function handleIsOpenDiarySetDelete() {
		setDiarySetId(diarySet.diarySetId);
		setIsOpenDiarySetDeleteModal(true);
		setIsEditPopUp(false);
	}

	async function handleBookmarkCreate() {
		const { data } = await createBookmark(diarySet.diarySetId);
		if (data) await fetchDiarySetList();
	}

	async function handleBookmardDelete() {
		const { data } = await deleteBookmark(diarySet.diarySetId);
		if (data) await fetchDiarySetList();
	}

	/** 사용자 관찰일지 삭제하는 함수 */
	async function handleDiarySetDelete() {
		try {
			const { data } = await deleteDiarySet(diarySet.diarySetId);
			setIsOpenDiarySetDeleteModal(false);
			setIsEditPopUp(false);
			await fetchDiarySetList();
		} catch (error) {
			setIsOpenDiarySetDeleteModal(false);
			setIsEditPopUp(false);
		}
	}

	/** 수정/삭제 팝업 띄우는 함수 */
	function handleisEditToggle() {
		setIsEditPopUp(!isEditPopUp);
	}

	return (
		<>
			<DiarySetModal
				isOpen={isOpenDiarySetUpdateModal}
				update
				modalTitle="관찰일지 수정"
				diarySetId={diarySetId}
				handleModalClose={() => setIsOpenDiarySetUpdateModal(false)}
				fetchDiarySetList={fetchDiarySetList}
			/>
			<AppModal
				isOpen={isOpenDiarySetDeleteModal}
				title="관찰일지 삭제"
				handleModalClose={() => setIsOpenDiarySetDeleteModal(false)}
				handleModalConfirm={handleDiarySetDelete}
			/>

			<div className={`${styles.wrap}`}>
				<div className={`${styles.content} rounded space-y-2`}>
					<Link href={`/diaryset/list/${diarySet.diarySetId}`} className="relative">
						<Image src={diarySet.imagePath} className={`${styles.img} w-full`} priority width={150} height={150} alt="관찰일지 썸네일" />
						<div className={`${styles.card} absolute bottom-0`}>{diarySet.title}</div>
					</Link>

					<div>
						<div className="relative ">
							{isSameUser ? (
								<span className="material-symbols-outlined md cursor-pointer absolute top-0 -right-1" onClick={handleisEditToggle}>
									more_vert
								</span>
							) : null}

							{isSameUser ? (
								<div className="flex items-center">
									<span className="material-symbols-outlined md-main fill-main mr-0.5">bookmark</span>
									{diarySet.bookmarkCount}
								</div>
							) : (
								<div className="flex items-center cursor-pointer">
									{diarySet.isBookmarked ? (
										<span className="material-symbols-outlined md-main fill-main mr-0.5" onClick={handleBookmardDelete}>
											bookmark
										</span>
									) : (
										<span className="material-symbols-outlined md-main mr-0.5" onClick={handleBookmarkCreate}>
											bookmark
										</span>
									)}
									{diarySet.bookmarkCount}
								</div>
							)}
						</div>

						{isEditPopUp ? (
							<div className="relative">
								<div className={`popUp ${styles.popUp}`}>
									<div onClick={handleIsOpenDiarySetUpdate}>수정</div>
									<div onClick={handleIsOpenDiarySetDelete}>삭제</div>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
