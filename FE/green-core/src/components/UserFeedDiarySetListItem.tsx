import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function UserFeedDiarySetListItem({ diarySet }) {
	const [isEditPopUp, setIsEditPopUp] = useState(false);

	const [diarySetId, setDiarySetId] = useState(null);
	const [diarySetList, setDiarySetList] = useState([]);

	const [isOpenDiarySetUpdateModal, setIsOpenDiarySetUpdateModal] = useState(false);
	const [isOpenDiarySetDeleteModal, setIsOpenDiarySetDeleteModal] = useState(false);

	function handleIsOpenDiarySetUpdate(diarySetId: number) {
		setDiarySetId(diarySetId);
		setIsOpenDiarySetUpdateModal(true);
	}

	function handleIsOpenDiarySetDelete(diarySetId: number) {
		setDiarySetId(diarySetId);
		setIsOpenDiarySetDeleteModal(true);
	}

	/** 수정/삭제 팝업 띄우는 함수 */
	function handleisEditToggle() {
		setIsEditPopUp(!isEditPopUp);
	}

	return (
		<>
			<div key={diarySet.diarySetId} className="mx-5 mt-2">
				<span className="material-symbols-outlined" onClick={handleisEditToggle}>
					more_vert
				</span>

				{isEditPopUp ? (
					<div>
						<div onClick={() => handleIsOpenDiarySetUpdate(diarySet.diarySetId)}>관찰일지 수정</div>
						<div onClick={() => handleIsOpenDiarySetDelete(diarySet.diarySetId)}>관찰일지 삭제</div>
					</div>
				) : null}

				<Image src={'/images/noProfile.png'} priority width={100} height={100} alt="관찰일지 썸네일" />
				<Link href={`/diary/${diarySet.diarySetId}`}>제목: {diarySet.title}</Link>
				<div>북마크 카운트: {diarySet.bookmarkCount}</div>
				<div>북마크 토글: {diarySet.isBookmarked}</div>
				<span className="material-symbols-outlined">bookmark</span>
				<div>일지 카운트: {diarySet.diaryCount}</div>
			</div>
		</>
	);
}
