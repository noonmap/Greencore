import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import AppLayout from '@/layout/AppLayout';
import DiaryListItem from '@/components/DiaryListItem';
import styles from '@/styles/post/diarySet.module.scss';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getDiaryList } from '~/src/core/diary/diaryAPI';
import { createBookmark, deleteBookmark, deleteDiarySet } from '@/core/diarySet/diarySetAPI';
import Image from 'next/image';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Skeleton from 'react-loading-skeleton';
import DiarySetModal from '@/components/modal/DiarySetModal';
import AppModal from '@/components/common/AppModal';
import AppLoading from '@/components/common/AppLoading';
import { clipByValue } from '@tensorflow/tfjs';
import { SET_IS_SAME_USER_FALSE, SET_IS_SAME_USER_TRUE } from '@/core/user/userSlice';

export default function diarySet() {
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector<boolean>((state) => state.diary.isLoading);
	const diaryList = useAppSelector<Array<any>>((state) => state.diary.diaryList);
	const diarySet = useAppSelector<any>((state) => state.diary.diarySet);
	const [isBookmarked, setIsBookmarked] = useState<boolean | null>(diarySet.isBookmarked);

	const isSameUser = useAppSelector((state) => state.user.isSameUser);

	const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
	const myNickname = useAppSelector((state) => state.common?.userInfo.nickname);

	const divRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { diarySetId } = router.query;
	const storage = getStorage();
	const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');

	const [isOpenDiarySetUpdateModal, setIsOpenDiarySetUpdateModal] = useState(false);
	const [isOpenDiarySetDeleteModal, setIsOpenDiarySetDeleteModal] = useState(false);

	const [nickname, setNickname] = useState<string | string[]>('');

	/** url path의 유저와 현재 로그인 유저가 같은지 확인하는 함수 */
	const checkSameUser = useCallback(() => {
		if (myNickname == nickname) dispatch(SET_IS_SAME_USER_TRUE());
		else dispatch(SET_IS_SAME_USER_FALSE());
	}, [myNickname, nickname]);

	/** 사용자 프로필 이미지 가져오는 함수 */
	function getUserProfile(nickname: string) {
		const profileRef = ref(storage, `${nickname}/profileImage`);

		getDownloadURL(profileRef)
			.then((downloadURL) => {
				setUserProfileImagePath(downloadURL);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	// 새로고침하기
	const handleRefresh = () => {
		router.reload();
	};

	// searchState 변경
	function changeSearchState() {
		dispatch(SET_IS_SEARCH_STATE('default'));
	}

	// 바깥 클릭시
	const handleClickOutside = (event) => {
		if (event.target.innerText != 'more_vert') {
			setIsEditOpen(false);
		}
	};

	useEffect(() => {
		changeSearchState();

		if (diarySetId) {
			dispatch(getDiaryList(Number(diarySetId)));
		}

		document.addEventListener('click', handleClickOutside);
		return () => {};
	}, [diarySetId, myNickname]);

	useEffect(() => {
		setIsBookmarked(diarySet.isBookmarked);
		getUserProfile(diarySet.user?.nickname);
		checkSameUser();
		setNickname(diarySet.user?.nickname);

		return () => {};
	}, [diarySet, nickname]);

	// 뒤로가기
	function goBack() {
		router.back();
	}

	// 북마크
	function postBookmark() {
		if (isBookmarked) {
			// 북마크 취소
			deleteBookmark(Number(diarySetId)).then((res) => {
				if (res.result === 'SUCCESS') {
					setIsBookmarked(false);
				}
			});
		} else {
			// 북마크 설정
			createBookmark(Number(diarySetId)).then((res) => {
				if (res.result === 'SUCCESS') {
					setIsBookmarked(true);
				}
			});
		}
	}

	function openEditPopUp(event) {
		event.stopPropagation();
		setIsEditOpen(true);
	}

	/** 사용자 관찰일지 삭제하는 함수 */
	async function handleDiarySetDelete() {
		try {
			const { data } = await deleteDiarySet(Number(diarySetId));
			console.log(data);
			router.push('/home/recommend');
			setIsOpenDiarySetDeleteModal(false);
		} catch (error) {
			console.error(error);
			setIsOpenDiarySetDeleteModal(false);
		}
	}

	return (
		<AppLayout>
			<DiarySetModal
				isOpen={isOpenDiarySetUpdateModal}
				update
				modalTitle="관찰일지 수정"
				diarySetId={Number(diarySetId)}
				handleModalClose={() => setIsOpenDiarySetUpdateModal(false)}
				fetchDiarySetList={handleRefresh}
			/>
			<AppModal
				isOpen={isOpenDiarySetDeleteModal}
				title="관찰일지 삭제"
				handleModalClose={() => setIsOpenDiarySetDeleteModal(false)}
				handleModalConfirm={handleDiarySetDelete}
			/>

			{isLoading ? (
				<AppLoading />
			) : (
				<div className="px-4 py-4">
					{/* 헤더 */}
					<div className="flex items-center">
						<span className={`material-symbols-outlined cursor-pointer mr-2`} onClick={goBack} style={{ fontSize: '2rem', fontWeight: '600' }}>
							arrow_back
						</span>
						<span className={`${styles.title} py-1`}>관찰일지</span>
					</div>

					<div className={`flex flex-col mx-auto  2xl:px-10 2xl:py-8 px-5 py-5`}>
						{/* 바디 */}
						<div className="flex">
							{/* 세로1 */}
							<div className="flex flex-col items-center 2xl:py-5 py-2">
								{/* 프로필 */}
								<div style={{ width: '80px', height: '80px' }} className="flex flex-col items-center">
									<Link href={`/user/feed/${diarySet?.user?.nickname}`}>
										{userProfileImagePath ? (
											<Image
												priority
												src={userProfileImagePath}
												width={80}
												height={80}
												alt="프로필 사진"
												className="rounded-full"
												style={{ width: '80px', height: '80px' }}
											/>
										) : (
											<Skeleton width={80} height={80} />
										)}
									</Link>

									<div className="font-bold text-md my-2">{diarySet?.user?.nickname}</div>

									<div className="mr-3">
										{isSameUser ? null : (
											<div className="flex items-center">
												<span
													className={`material-symbols-outlined cursor-pointer ${isBookmarked ? `${styles.materialSymbolsOutlined} main` : ''}`}
													onClick={postBookmark}>
													bookmark
												</span>
												<span className="text-sm">북마크</span>
											</div>
										)}
									</div>

									<div className="text-lg flex justify-center items-center pr-5 mb-4">
										<div className="relative">
											{myNickname === diarySet?.user?.nickname && (
												<>
													<span className="material-symbols-outlined" onClick={openEditPopUp} style={{ cursor: 'pointer' }}>
														more_vert
													</span>
													<div ref={divRef} className={`${isEditOpen ? styles.editPopUp : 'hidden'} rounded-xl overflow-hidden`}>
														{/* TODO : 수정 페이지 모달 */}
														<div
															className="border-b border-slate-300 bg-white flex justify-center items-center"
															onClick={() => setIsOpenDiarySetUpdateModal(true)}>
															<span className="text-lg p-2">수정</span>
															<span className="material-symbols-outlined">edit</span>
														</div>

														{/* TODO : 삭제 하기, 삭제 경고 모달 */}
														<div
															className="bg-white flex justify-center items-center text-red-400"
															onClick={() => setIsOpenDiarySetDeleteModal(true)}>
															<span className="text-lg p-2">삭제</span>
															<span className="material-symbols-outlined">delete</span>
														</div>
													</div>
												</>
											)}
										</div>

										{/* 일지생성 */}
										{isSameUser ? (
											<Link
												href={'/diary/create'}
												className="flex items-center cursor-pointer bg-gray-100 rounded-full p-0.5"
												style={{ backgroundColor: 'var(--main-color)' }}>
												<span className="material-symbols-outlined font-bold text-white" style={{ fontSize: '1.2rem' }}>
													add
												</span>
												<div className="pr-1 font-bold text-white" style={{ fontSize: '0.8rem' }}>
													ADD
												</div>
											</Link>
										) : null}
									</div>
								</div>
							</div>

							{/* 세로2 */}
							<div className="flex flex-col grow">
								{/* 닉네임, 아이콘 */}

								{/* 일지리스트 */}
								<div className={`${styles.diaryList} mx-7`}>
									{diaryList.map((diary, index) => (
										<DiaryListItem key={diary?.diaryId} diary={diary} title={diarySet.title} isLast={diaryList.length - 1 === index ? true : false} />
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</AppLayout>
	);
}
