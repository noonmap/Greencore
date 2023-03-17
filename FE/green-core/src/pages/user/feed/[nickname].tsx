import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { useForm } from 'react-hook-form';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getProfile, getUserPlantList, deleteUserPlant } from '@/core/user/userAPI';
import { deleteFollow, updateFollow } from '@/core/follow/followAPI';
import Skeleton from 'react-loading-skeleton';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import AppModal from '@/components/common/AppModal';
import UserPlantModal from '@/components/common/UserPlantModal';
import DiaryModal from '@/components/common/DiaryModal';
import { getDiarySetList } from '@/core/diarySet/diarySetAPI';

type ProfileType = {
  followerCount: number;
  followingCount: number;
  introduction: string;
  isFollowed: boolean;
  nickname: string;
  profileImagePath: string;
};

type UserPlantType = {
  plantId: number;
  plantImagePath: string;
  plantName: string;
  plantNickname: string;
  userPlantId: number;
};

type StateType = {
  uploadProfileImage: File;
};

const initialState: StateType = {
  uploadProfileImage: null,
};

export default function FeedDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const storage = getStorage();

  const { nickname } = router.query;
  const myNickname = useAppSelector((state) => state.common.userInfo?.nickname);

  const { register, getValues, watch } = useForm<StateType>({ defaultValues: initialState });
  const [uploadProfileImage] = getValues(['uploadProfileImage']);

  const [isSameUser, setIsSameUser] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<ProfileType>();
  const [userPlantList, setUserPlantList] = useState<Array<UserPlantType>>();
  const [userPlantListAll, setUserPlantListAll] = useState<Array<UserPlantType>>();
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>(null);
  const [isEditPopUp, setIsEditPopUp] = useState(true);
  const [isOpenUserPlantCreateModal, setIsOpenUserPlantCreateModal] = useState(false);
  const [isOpenUserPlantUpdateModal, setIsOpenUserPlantUpdateModal] = useState(false);
  const [isOpenUserPlantDeleteModal, setIsOpenUserPlantDeleteModal] = useState(false);
  const [isOpenDiaryCreateModal, setIsOpenDiaryCreateModal] = useState(false);
  const [userPlantId, setUserPlantId] = useState(null);
  const [userPlantNickname, setUserPlantNickname] = useState('');

  const [userPlantPage, setUserPlantPage] = useState(0);
  const [userPlantSize, setUserPlantSize] = useState(2);
  const [userPlantListTotalCount, setUserPlantListTotalCount] = useState(8);

  const [diarySetPage, setDiarySetPage] = useState(0);
  const [diarySetSize, setDiarySetSize] = useState(2);
  const [diarySetListTotalCount, setDiarySetListTotalCount] = useState(8);

  const [diarySetList, setDiarySetList] = useState([]);

  const checkSameUser = useCallback(() => {
    if (myNickname == nickname) setIsSameUser(true);
  }, [myNickname, nickname]);

  const fetchUserProfile = useCallback(async () => {
    const { data } = await getProfile(nickname);
    setUserProfile(data);

    const profileRef = ref(storage, `${nickname}/profileImage`);

    getDownloadURL(profileRef)
      .then((downloadURL) => {
        setUserProfileImagePath(downloadURL);
      })
      .catch((error) => {
        switch (error.code) {
          case 'storage/object-not-found':
            setUserProfileImagePath(null);
            break;
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break;
          case 'storage/unknown':
            break;
        }
      });
  }, [nickname]);

  const fetchUserPlantList = useCallback(async () => {
    try {
      const params = { page: userPlantPage, size: userPlantSize };
      const { data } = await getUserPlantList(nickname, params);

      // FIXME: 확인
      let temp = data.slice(userPlantPage, userPlantPage + userPlantSize);
      setUserPlantList(temp);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, userPlantPage, userPlantSize]);

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
      // console.log(data);

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

      setDiarySetList(data);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, diarySetPage, diarySetSize]);

  async function nextPage() {
    let page = userPlantPage + userPlantSize;
    if (page >= userPlantListTotalCount) return;

    setUserPlantPage(page);
    await fetchUserPlantList();
  }

  async function prevPage() {
    let page = userPlantPage - userPlantSize;
    if (page < 0) return;

    setUserPlantPage(page);
    await fetchUserPlantList();
  }

  function handleImageExploerOpen() {
    const profileImageInput: HTMLElement = document.querySelector(`.profileImageInput`);
    profileImageInput.click();
  }

  function handleProfileImageUpdate() {
    if (!uploadProfileImage) return;

    const profileRef = ref(storage, `${myNickname}/profileImage`);
    const uploadTask = uploadBytesResumable(profileRef, uploadProfileImage[0]);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        Toastify({
          text: message.UpdateProfileImageFail,
          duration: 1500,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
        console.error(error);
      },
      () => {
        Toastify({
          text: message.UpdateProfileImageSuccess,
          duration: 1500,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUserProfileImagePath(downloadURL);
        });
      }
    );
  }

  async function handleFollowDelete() {
    const { data } = await deleteFollow(nickname);
    console.log(data);
  }

  async function handleFollowUpdate() {
    const { data } = await updateFollow(nickname);
    console.log(data);
  }

  function handleisEditToggle() {
    setIsEditPopUp(!isEditPopUp);
  }

  function handleUserPlantNicknameUpdate(userPlantId: number, plantNickname: string) {
    setUserPlantId(userPlantId);
    setUserPlantNickname(plantNickname);
    setIsOpenUserPlantUpdateModal(true);
  }

  function handleUserPlantDeleteOpen(userPlantId: number) {
    setUserPlantId(userPlantId);
    setIsOpenUserPlantDeleteModal(true);
  }

  async function handleUserPlantDelete() {
    try {
      const { data } = await deleteUserPlant(userPlantId);
      setIsOpenUserPlantDeleteModal(false);
      console.log(data);
    } catch (error) {
      console.error(error);
      setIsOpenUserPlantDeleteModal(false);
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    // console.log(router.query);

    checkSameUser();
    fetchUserProfile();
    fetchUserPlantList();
    fetchUserPlantListAll();
    fetchDiarySetList();
    watch();

    handleProfileImageUpdate();
    return () => {};
  }, [nickname, uploadProfileImage, userPlantPage, userPlantSize, diarySetPage, diarySetSize]); // 해당 변수가 업데이트 되면 한번 더 불러짐

  return (
    <AppLayout>
      <h1>프로필 라인</h1>

      <UserPlantModal
        isOpen={isOpenUserPlantCreateModal}
        create
        title={'내식물 생성'}
        handleModalClose={() => setIsOpenUserPlantCreateModal(false)}
      />
      <UserPlantModal
        isOpen={isOpenUserPlantUpdateModal}
        update
        userPlantId={userPlantId}
        userPlantNickname={userPlantNickname}
        title={'내식물 정보 수정'}
        handleModalClose={() => setIsOpenUserPlantUpdateModal(false)}
      />
      <AppModal
        isOpen={isOpenUserPlantDeleteModal}
        handleModalClose={() => setIsOpenUserPlantDeleteModal(false)}
        handleModalConfirm={handleUserPlantDelete}
      />

      {/* FIXME: 만약 내키식을 생성하지 않았다면 해당 모달이 뜨지않고 다른 알람 모달이 뜨도록 */}
      <DiaryModal isOpen={isOpenDiaryCreateModal} userPlantList={userPlantListAll} handleModalClose={() => setIsOpenDiaryCreateModal(false)} />

      <div className='space-y-2 '>
        {/* 프로필 라인 */}
        <div>
          <input type='file' accept='image/*' hidden className='profileImageInput' {...register('uploadProfileImage')} />
          <div className='flex space-x-3'>
            <div onClick={handleImageExploerOpen}>
              {userProfileImagePath ? (
                (
                  <Image
                    src={userProfileImagePath}
                    alt='사용자 프로필 이미지'
                    width={90}
                    height={90}
                    className='rounded-full bg-cover'
                    onClick={handleProfileImageUpdate}
                    priority
                  />
                ) || <Skeleton width={90} height={90} circle />
              ) : (
                <Image src='/images/noProfile.png' alt='사용자 프로필 이미지' width={90} height={90} className='rounded-full bg-cover' priority />
              )}
            </div>

            <div>
              <div className='flex'>
                <div>{userProfile?.nickname}</div>
                {isSameUser ? (
                  <Link href='/user/settings'>
                    <span className='material-symbols-outlined'>edit</span>
                  </Link>
                ) : null}
              </div>
              <div>{userProfile?.introduction}</div>
              <div>
                {userProfile?.isFollowed ? (
                  <button className='bg-blue-500 rounded' onClick={handleFollowDelete}>
                    팔로우중
                  </button>
                ) : (
                  <button className='bg-blue-500 rounded' onClick={handleFollowUpdate}>
                    팔로우하기
                  </button>
                )}
              </div>
            </div>
            <div>
              <div>팔로워 {userProfile?.followerCount}</div>
              <div>팔로잉 {userProfile?.followingCount}</div>
            </div>
          </div>
        </div>

        {/* 내키식 라인 */}
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
                <button className='bg-blue-500 rounded' onClick={prevPage}>
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
                        <div onClick={() => handleUserPlantNicknameUpdate(userPlant.userPlantId, userPlant.plantNickname)}>내키식 닉네임 수정</div>
                        <div onClick={() => handleUserPlantDeleteOpen(userPlant.userPlantId)}>내키식 삭제</div>
                      </div>
                    ) : null}
                  </div>
                ))}

                <button className='bg-blue-500 rounded' onClick={nextPage}>
                  다음
                </button>
              </div>
            )
          ) : (
            <div>아직 생성하지않았음</div>
          )}
        </div>

        {/* 관찰일지 라인 */}
        <div>
          <h1>관찰일지 라인</h1>

          <button className='bg-blue-500 rounded' onClick={() => setIsOpenDiaryCreateModal(true)}>
            관찰일지 생성
          </button>

          <div className='flex'>
            <button className='bg-blue-500 rounded'>이전</button>

            {diarySetList.map((d) => (
              <div key={d.diarySetId}>
                <Image src={'/images/noProfile.png'} priority width={100} height={100} alt='관찰일지 썸네일' />
                <div>제목: {d.title}</div>
                <div>북마크 카운트: {d.bookmardCount}</div>
                <div>북마크 토글: {d.isBookmarked}</div>
                <span className='material-symbols-outlined'>bookmark</span>
                <div>일지 카운트: {d.diaryCount}</div>
              </div>
            ))}

            <button className='bg-blue-500 rounded'>다음</button>
          </div>
        </div>

        {/* 포스트 라인 */}
        <div>포스트 라인</div>
      </div>
    </AppLayout>
  );
}
