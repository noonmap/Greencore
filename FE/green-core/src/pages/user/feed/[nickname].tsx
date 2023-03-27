import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { useForm } from 'react-hook-form';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getProfile, getUserPlantList, deleteUserPlant } from '@/core/user/userAPI';
import Skeleton from 'react-loading-skeleton';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import ReactPaginate from 'react-paginate';

import AppModal from '@/components/common/AppModal';
import DiarySetModal from '@/components/modal/DiarySetModal';
import { getDiarySetList, deleteDiarySet } from '@/core/diarySet/diarySetAPI';

import styles from '@/styles/UserFeed.module.scss';
import UserFeedProfile from '@/components/UserFeedProfile';
import UserFeedPlant from '@/components/UserFeedPlant';

type UserPlantType = {
  plantId: number;
  plantImagePath: string;
  plantName: string;
  plantNickname: string;
  userPlantId: number;
};

type StateType = {
  uploadProfileImage: File;
  checkedPostList: Array<Object>; // FIXME: 타입 수정
};

const initialState: StateType = {
  uploadProfileImage: null,
  checkedPostList: [],
};

export default function FeedDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { nickname } = router.query;

  const { register, getValues, watch } = useForm<StateType>({ defaultValues: initialState });
  const [uploadProfileImage, checkedPostList] = getValues(['uploadProfileImage', 'checkedPostList']);

  const [isEditPopUp2, setIsEditPopUp2] = useState(false);

  const [isOpenDiarySetCreateModal, setIsOpenDiarySetCreateModal] = useState(false);
  const [isOpenDiarySetUpdateModal, setIsOpenDiarySetUpdateModal] = useState(false);
  const [isOpenDiarySetDeleteModal, setIsOpenDiarySetDeleteModal] = useState(false);

  const [isOpenPostDeleteModal, setIsOpenPostDeleteModal] = useState(false);
  const [isOpenSelectedPostDeleteModal, setIsOpenSelectedPostDeleteModal] = useState(false);

  const [diarySetId, setDiarySetId] = useState(null);

  const [userPlantListTotalCount, setUserPlantListTotalCount] = useState(8);

  const [diarySetPage, setDiarySetPage] = useState(0);
  const [diarySetSize, setDiarySetSize] = useState(2);
  const [diarySetListTotalCount, setDiarySetListTotalCount] = useState(3);

  const [diarySetList, setDiarySetList] = useState([]);
  const [diarySetListAll, setDiarySetListAll] = useState([]);
  const [userPlantListAll, setUserPlantListAll] = useState<Array<UserPlantType>>();

  const [postList, setPostList] = useState([]);
  const [postListTotalCount, setPostListTotalCount] = useState(3);
  const [postPage, setPostPage] = useState(0);

  useEffect(() => {
    watch();
    fetchDiarySetList();
    fetchDiarySetListAll();
    fetchPostList();
    return () => {};
  }, [nickname, uploadProfileImage, checkedPostList, userPlantListTotalCount, diarySetSize, postPage]); // 해당 변수가 업데이트 되면 한번 더 불러짐

  async function fetchUserPlantListAll() {
    try {
      const params = { page: 0, size: userPlantListTotalCount };
      const { data } = await getUserPlantList(nickname, params);
      setUserPlantListAll(data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchDiarySetList = useCallback(async () => {
    try {
      const params = { page: diarySetPage, size: diarySetSize };
      // const { data } = await getDiarySetList(nickname, params);

      const data = [
        {
          diarySetId: 1,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목1',
        },
        {
          diarySetId: 2,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목2',
        },
        {
          diarySetId: 3,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목3',
        },
      ];

      // FIXME: 확인
      let temp = data.slice(diarySetPage, diarySetPage + diarySetSize);
      setDiarySetList(temp);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, diarySetPage, diarySetSize]);

  async function fetchDiarySetListAll() {
    try {
      const params = { page: 0, size: diarySetListTotalCount };
      // const { data } = await getDiarySetList(nickname, params);

      const data = [
        {
          diarySetId: 1,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목1',
        },
        {
          diarySetId: 2,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목2',
        },
        {
          diarySetId: 3,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목3',
        },
      ];

      setDiarySetListAll(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchPostList() {
    try {
      // const { data } = await getPostList(nickname);
      const data = [
        {
          postId: 1,
          content: '내 아기방토 입으로 호로...', // 잘린 글자
          commentCount: 2,
          likeCount: 0,
          createdAt: '2023-03-03',
        },
        {
          postId: 2,
          content: '내 아기방토 입으로 호로록 하...',
          commentCount: 5,
          likeCount: 9,
          createdAt: '2023-03-03',
        },
        {
          postId: 3,
          content: '아기방토 내 입에 저장',
          commentCount: 22,
          likeCount: 17,
          createdAt: '2023-03-03',
        },
      ];

      // FIXME: 확인
      let temp = data.slice(postPage, postPage + 1);
      console.log(temp);
      setPostList(temp);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function prevDiarySetListPage() {
    let page = diarySetPage - diarySetSize;
    if (page < 0) return;

    setDiarySetPage(page);
    await fetchDiarySetList();
  }

  async function nextDiarySetListPage() {
    let page = diarySetPage + diarySetSize;
    if (page >= userPlantListTotalCount) return;

    setDiarySetPage(page);
    await fetchDiarySetList();
  }

  async function handlePostPageClick(e) {
    setPostPage(e.selected);
    // console.log(e.selected);
    // setPostPage((e.selected / 2) * postListTotalCount);
    // const newOffset = (e.selected * itemsPerPage) % items.length;
    // setItemOffset(newOffset);
  }

  function handleIsOpenDiarySetUpdate(diarySetId: number) {
    setDiarySetId(diarySetId);
    setIsOpenDiarySetUpdateModal(true);
  }

  function handleIsOpenDiarySetDelete(diarySetId: number) {
    setDiarySetId(diarySetId);
    setIsOpenDiarySetDeleteModal(true);
  }

  async function handleDiarySetDelete(diarySetId: number) {
    try {
      const { data } = await deleteDiarySet(diarySetId);
      console.log(data);
      setIsOpenDiarySetDeleteModal(false);
    } catch (error) {
      console.error(error);
      setIsOpenDiarySetDeleteModal(false);
    }
  }

  function handleIsOpenPostDelete() {
    setIsOpenPostDeleteModal(true);
  }

  function handleIsOpenSelectedPostDelete() {
    setIsOpenSelectedPostDeleteModal(true);
  }

  async function handlePostDelete() {
    try {
      // const {data} = await deletePost(postId);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSelectedPostDelete() {
    checkedPostList.forEach((postId) => {
      try {
        // const { data } = await deletePost(postId);
      } catch (error) {
        console.error(error);
      }
    });
  }

  function handleisEditToggle2() {
    setIsEditPopUp2(!isEditPopUp2);
  }

  return (
    <AppLayout>
      {/* FIXME: 만약 내키식을 생성하지 않았다면 해당 모달이 뜨지않고 다른 알람 모달이 뜨도록 */}
      <DiarySetModal
        isOpen={isOpenDiarySetCreateModal}
        modalTitle='관찰일지 생성'
        create
        userPlantList={userPlantListAll}
        handleModalClose={() => setIsOpenDiarySetCreateModal(false)}
      />
      <DiarySetModal
        isOpen={isOpenDiarySetUpdateModal}
        update
        modalTitle='관찰일지 수정'
        diarySetId={diarySetId}
        handleModalClose={() => setIsOpenDiarySetUpdateModal(false)}
      />
      <AppModal
        isOpen={isOpenDiarySetDeleteModal}
        title='관찰일지 삭제'
        handleModalClose={() => setIsOpenDiarySetDeleteModal(false)}
        handleModalConfirm={handleDiarySetDelete}
      />

      <AppModal
        isOpen={isOpenPostDeleteModal}
        title='포스트 삭제'
        handleModalClose={() => setIsOpenPostDeleteModal(false)}
        handleModalConfirm={handlePostDelete}
      />
      <AppModal
        isOpen={isOpenSelectedPostDeleteModal}
        title='포스트 삭제'
        handleModalClose={() => setIsOpenSelectedPostDeleteModal(false)}
        handleModalConfirm={handleSelectedPostDelete}
      />

      <div className='space-y-2 px-3 py-5'>
        {/* 타이틀 */}
        <h1 className='main'>프로필</h1>

        <div className={`${styles.wrap}`}>
          <div className={`${styles.content} space-y-5`}>
            <UserFeedProfile />
            <UserFeedPlant nickname={nickname} />
          </div>
        </div>

        {/* 내키식 라인
        <div className='space-y-2 '>
          <h1>내키식 라인</h1>
          <button className='rounded bg-blue-500' onClick={() => setIsOpenUserPlantCreateModal(true)}>
            내키식 생성
          </button>
          {userPlantList ? (
            userPlantList.length < 0 ? (
              <div>빈 userPlant</div>
            ) : (
              <div className='flex flex-row space-x-4'>
                <button className='bg-blue-500 rounded' onClick={prevUserPlantListPage}>
                  이전
                </button>

                {userPlantList.map((userPlant) => (
                  <div key={userPlant.userPlantId}>
                    <Image src='/images/noProfile.png' alt='사용자 식물' width={70} height={70} priority />
                    <div>{userPlant.plantNickname}</div>
                    <span className='material-symbols-outlined' onClick={handleisEditToggle}>
                      more_vert
                    </span>

                    {isEditPopUp ? (
                      <div>
                        <div onClick={() => handleIsOpenUserPlantNicknameUpdate(userPlant.userPlantId, userPlant.plantNickname)}>
                          내키식 닉네임 수정
                        </div>
                        <div onClick={() => handleIsOpenUserPlantDelete(userPlant.userPlantId)}>내키식 삭제</div>
                      </div>
                    ) : null}
                  </div>
                ))}

                <button className='bg-blue-500 rounded' onClick={nextUserPlantListPage}>
                  다음
                </button>
              </div>
            )
          ) : (
            <div>아직 생성하지않았음</div>
          )}
        </div> */}

        {/* 관찰일지 라인 */}
        <div>
          <h1>관찰일지 라인</h1>

          <button className='bg-blue-500 rounded' onClick={() => setIsOpenDiarySetCreateModal(true)}>
            관찰일지 생성
          </button>

          <div className='flex'>
            <button className='bg-blue-500 rounded' onClick={prevDiarySetListPage}>
              이전
            </button>

            {diarySetList.map((d) => (
              <div key={d.diarySetId}>
                <span className='material-symbols-outlined' onClick={handleisEditToggle2}>
                  more_vert
                </span>

                {isEditPopUp2 ? (
                  <div>
                    <div onClick={() => handleIsOpenDiarySetUpdate(d.diarySetId)}>관찰일지 수정</div>
                    <div onClick={() => handleIsOpenDiarySetDelete(d.diarySetId)}>관찰일지 삭제</div>
                  </div>
                ) : null}

                <Image src={'/images/noProfile.png'} priority width={100} height={100} alt='관찰일지 썸네일' />
                <Link href={`/diary/${d.diarySetId}`}>제목: {d.title}</Link>
                <div>북마크 카운트: {d.bookmarkCount}</div>
                <div>북마크 토글: {d.isBookmarked}</div>
                <span className='material-symbols-outlined'>bookmark</span>
                <div>일지 카운트: {d.diaryCount}</div>
              </div>
            ))}

            <button className='bg-blue-500 rounded' onClick={nextDiarySetListPage}>
              다음
            </button>
          </div>
        </div>

        {/* 포스트 라인 */}
        <div>
          <h1>포스트 라인</h1>

          <button className='bg-blue-500 rounded' onClick={handleIsOpenSelectedPostDelete}>
            선택 삭제
          </button>

          {postList.map((p) => (
            <div className='flex space-x-2' key={p.postId}>
              <input type='checkbox' value={p.postId} {...register('checkedPostList')} />
              <Link href={`/post/${p.postId}`}>{p.content}</Link>
              <div>commentCount {p.commentCount}</div>
              <div>likeCount {p.likeCount}</div>
              <div>{p.fetchPostList}</div>
              <span className='material-symbols-outlined' onClick={handleIsOpenPostDelete}>
                close
              </span>
            </div>
          ))}

          <ReactPaginate
            pageCount={postListTotalCount}
            pageRangeDisplayed={10}
            marginPagesDisplayed={5}
            breakLabel={'...'}
            previousLabel={
              <a
                href='/'
                className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                <span className='sr-only'>Previous</span>
                <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    strokeWidth='evenodd'
                    d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                    clipRule='evenodd'></path>
                </svg>
              </a>
            }
            nextLabel={
              <a
                href='/'
                className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                <span className='sr-only'>Next</span>
                <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    strokeWidth='evenodd'
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'></path>
                </svg>
              </a>
            }
            onPageChange={handlePostPageClick}
            containerClassName={'pagination-ul inline-flex items-center -space-x-px'}
            pageClassName={
              'block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }
            activeClassName={
              'currentPage px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }
            previousClassName={'pageLabel-btn '}
            nextClassName={'pageLabel-btn'}
          />
        </div>
      </div>
    </AppLayout>
  );
}
