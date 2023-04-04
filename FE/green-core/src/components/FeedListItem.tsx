import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { deleteDiary } from '@/core/diary/diaryAPI';
import { deletePost } from '@/core/post/postAPI';
import { FeedType } from '../core/feed/feedType';
import CommentDeleteModal from '@/components/modal/CommentDeleteModal';
import { createLike, deleteLike } from '@/core/feed/feedAPI';
import { updateFollow, deleteFollow } from '@/core/follow/followAPI';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styles from './FeedListItem.module.scss';
import Image from 'next/image';

export default function FeedListItem(props: { feed: FeedType }) {
  const feed = props.feed;
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState<boolean>(feed.isLiked);
  const [likeCount, setLikeCount] = useState<number>(feed.likeCount);
  const [isfollowed, setIsFollowed] = useState<boolean>(feed.user.isFollowed);
  const [followerCount, setFollowerCount] = useState<number>(feed.user.followerCount);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isOpenFeedDeleteModal, setIsOpenFeedDeleteModal] = useState(false);
  const { nickname: myNickname } = useAppSelector((state) => state.common?.userInfo);
  const reff = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const storage = getStorage();

  // 이미지 불러오기
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');
  /** 사용자 프로필 이미지 가져오는 함수 */

  useEffect(() => {
    getUserProfile(feed.user.nickname);
  }, []);

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

  // 이미지 스켈레톤
  const [isLoadingErrorAtProfileImage, setIsLoadingErrorAtProfileImage] = useState<boolean>(false);
  const [isLoadingErrorAtFeedImage, setIsLoadingErrorAtFeedImage] = useState<boolean>(false);

  const handleImageLoadAtProfileImage = () => {
    setIsLoadingErrorAtProfileImage(false);
  };

  const handleImageErrorAtProfileImage = () => {
    setIsLoadingErrorAtProfileImage(true);
  };

  const handleImageLoadAtFeedImage = () => {
    setIsLoadingErrorAtFeedImage(false);
  };

  const handleImageErrorAtFeedImage = () => {
    setIsLoadingErrorAtFeedImage(true);
  };
  //

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.innerText != 'more_vert') {
        setIsEditOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {};
  }, []);

  function handlePostLike(event) {
    event.stopPropagation();
    createLike(feed.feedId).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    });
  }

  function handleDeleteLike(event) {
    event.stopPropagation();
    deleteLike(feed.feedId).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      }
    });
  }

  function handlePostFollow(event) {
    event.stopPropagation();
    updateFollow(feed.user.nickname).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsFollowed(true);
        setFollowerCount(followerCount + 1);
      }
    });
  }

  function handleDeleteFollow(event) {
    event.stopPropagation();
    deleteFollow(feed.user.nickname).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsFollowed(false);
        setFollowerCount(followerCount - 1);
      }
    });
  }

  function getData(createdAt: string) {
    const created = new Date(createdAt);

    const SECONDS_IN_MINUTE = 60;
    const SECONDS_IN_HOUR = 3600;
    const SECONDS_IN_DAY = 86400;

    const today = new Date();
    const diffSeconds = Math.floor((today.getTime() - created.getTime()) / 1000);

    if (diffSeconds < SECONDS_IN_MINUTE) {
      return `${diffSeconds}초 전`;
    } else if (diffSeconds < SECONDS_IN_HOUR) {
      const diffMinutes = Math.floor(diffSeconds / SECONDS_IN_MINUTE);
      return `${diffMinutes}분 전`;
    } else if (diffSeconds < SECONDS_IN_DAY) {
      const diffHours = Math.floor(diffSeconds / SECONDS_IN_HOUR);
      return `${diffHours}시간 전`;
    } else if (diffSeconds < SECONDS_IN_DAY * 7) {
      const diffDays = Math.floor(diffSeconds / SECONDS_IN_DAY);
      return `${diffDays}일 전`;
    } else {
      const year = created.getFullYear();
      const month = created.getMonth() + 1;
      const day = created.getDate();
      return `${year}년 ${month}월 ${day}일`;
    }
  }

  function openEditPopUp(event) {
    event.stopPropagation();
    setIsEditOpen(true);
  }

  function goDetail() {
    if (feed.feedCode === 'FEED_DIARY') {
      router.push(`/diary/${feed.feedId}`);
    } else {
      router.push(`/post/${feed.feedId}`);
    }
  }

  function goDiarySet(event) {
    event.stopPropagation();
    router.push(`/diaryset/list/${feed.diarySetId}`);
  }

  function goProfile(event) {
    event.stopPropagation();
    router.push(`/user/feed/${feed.user.nickname}`);
  }

  // 편집창
  function handleUpdateFeed(event) {
    event.stopPropagation();
    if (feed.feedCode === 'FEED_DIARY') {
      router.push(`/diary/update/${feed.feedId}`);
    } else {
      router.push(`/post/update/${feed.feedId}`);
    }
  }
  function handleDeleteFeed(event) {
    event.stopPropagation();
    setIsOpenFeedDeleteModal(true);
  }

  // 삭제
  const handleDeleteFeed2 = () => {
    try {
      if (feed.feedCode === 'FEED_DIARY') {
        const payload = { diaryId: feed.feedId, diarySetId: feed.diarySetId };
        const requestData = { router, payload };
        dispatch(deleteDiary(requestData));
      } else {
        const requestData = { router, postId: feed.feedId };
        dispatch(deletePost(requestData));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isOpenFeedDeleteModal && (
        <CommentDeleteModal
          isOpen={isOpenFeedDeleteModal}
          modalTitle='일지 삭제'
          handleDelete={handleDeleteFeed2}
          handleModalClose={() => setIsOpenFeedDeleteModal(false)}
        />
      )}
      <div className={`flex border-b border-inherit`} onClick={goDetail}>
        <div className={`flex flex-col`}>
          <div className={`pt-5 pl-5`}>
            {/* 프로필 사진 */}
            <div className={`${styles.helpTip} flex `}>
              <div onClick={goProfile} className={`overflow-hidden`} style={{ borderRadius: '40px' }}>
                {isLoadingErrorAtProfileImage && <Skeleton width={80} height={80} />}
                <Image
                  className=''
                  src={userProfileImagePath}
                  alt='로고'
                  width='80'
                  height='80'
                  onLoad={() => handleImageLoadAtProfileImage()}
                  onError={() => handleImageErrorAtProfileImage()}
                  style={{ display: isLoadingErrorAtProfileImage ? 'none' : 'block' }}></Image>
              </div>

              {/* 프로필 팝업 */}
              <div className={`flex flex-col div ${styles.userInfo}`} onClick={goProfile}>
                <div className={`flex`}>
                  <div className={`flex flex-col justify-center items-center mr-5 overflow-hidden`} style={{ borderRadius: '40px' }}>
                    {isLoadingErrorAtProfileImage && <Skeleton width={80} height={80} />}
                    <Image
                      className='mb-3'
                      src={userProfileImagePath}
                      alt='로고'
                      width='80'
                      height='80'
                      onLoad={() => handleImageLoadAtProfileImage()}
                      onError={() => handleImageErrorAtProfileImage()}
                      style={{ display: isLoadingErrorAtProfileImage ? 'none' : 'block' }}></Image>
                  </div>

                  <div className='flex flex-col justify-center items-center'>
                    <div className='text-xl font-bold'>
                      <span>{feed.user.nickname || <Skeleton />}</span>
                    </div>
                    <div className='flex justify-center items-center text-sm'>
                      <div className='flex flex-col justify-center items-center w-20'>
                        <span>팔로워</span>
                        <span>{followerCount}</span>
                      </div>
                      <div className='flex flex-col justify-center items-center w-20'>
                        <span>팔로잉</span>
                        <span>{feed.user.followingCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex py-5'>{feed.user.introduction}</div>
                <div className='flex justify-center rounded-lg overflow-hidden'>
                  {isfollowed ? (
                    <button className={`w-full `} onClick={handleDeleteFollow} style={{ backgroundColor: 'var(--thin-color)' }}>
                      팔로우 취소
                    </button>
                  ) : (
                    <button className={`text-white w-full`} onClick={handlePostFollow} style={{ backgroundColor: 'var(--main-color)' }}>
                      팔로우
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* 좋아요 */}
          <div className={`flex justify-center pl-5 py-2`}>
            <div className={`w-6/12 flex justify-end`}>
              {isLiked
                ? (
                    <span
                      className={`material-symbols-outlined ${styles.materialSymbolsOutlined}`}
                      style={{ cursor: 'pointer', color: 'crimson' }}
                      onClick={handleDeleteLike}>
                      favorite
                    </span>
                  ) || <Skeleton />
                : (
                    <span className='material-symbols-outlined' style={{ cursor: 'pointer' }} onClick={handlePostLike}>
                      favorite
                    </span>
                  ) || <Skeleton />}
            </div>
            <div className='w-6/12 flex justify-start pl-2'>{likeCount}</div>
          </div>
          {/* 댓글 */}
          <div className='flex justify-center'>
            <div className={`pl-3 pr-2`}>
              <span className={`material-symbols-outlined `}>chat</span>
            </div>
            <div>{feed.commentCount}</div>
          </div>
        </div>
        <div className={`flex flex-col w-full`}>
          <div className={`pt-5 mt-2 pl-3 text-lg font-bold flex justify-between relative`}>
            {/* 닉네임 */}
            <span>{feed.user.nickname}</span>
            {/* 편집창 팝업 */}
            {myNickname === feed.user.nickname && (
              <div>
                <span className='material-symbols-outlined px-2' onClick={openEditPopUp} style={{ cursor: 'pointer' }}>
                  more_vert
                </span>
                <div ref={reff} className={`${isEditOpen ? styles.editPopUp : 'hidden'} rounded-xl overflow-hidden`}>
                  <div className='border-b border-slate-300 bg-white flex justify-center items-center' onClick={handleUpdateFeed}>
                    <span className='text-lg p-2'>수정</span>
                    <span className='material-symbols-outlined'>edit</span>
                  </div>

                  <div className='bg-white flex justify-center items-center text-red-400' onClick={handleDeleteFeed}>
                    <span className='text-lg p-2'>삭제</span>
                    <span className='material-symbols-outlined'>delete</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* 내용 */}
          <div className={`pl-3`}>{feed.content}</div>
          <div className={`p-3 mr-5`}>
            {feed.feedCode === 'FEED_DIARY' ? (
              <>
                {/* 다이어리일때 사진 */}
                <div className={`relative`}>
                  <div className={`${styles.imageWarrper} flex justify-center`}>
                    {isLoadingErrorAtFeedImage && <Skeleton width={400} height={400} style={{ borderRadius: '30px' }} />}
                    <img
                      className='mb-3'
                      src={feed.imagePath}
                      alt='로고'
                      width='100%'
                      // height='450px'
                      onLoad={() => handleImageLoadAtFeedImage()}
                      onError={() => handleImageErrorAtFeedImage()}
                      style={{ display: isLoadingErrorAtFeedImage ? 'none' : 'block' }}></img>
                  </div>
                  <div className={`${styles.gradation}`} style={{ display: isLoadingErrorAtFeedImage ? 'none' : 'block' }}>
                    <div className={`p-5 flex justify-between h-full`}>
                      <div className={`p-3 flex flex-col text-3xl text-white font-bold justify-end h-full `}>
                        <p>{feed.diarySetTitle}</p>
                        <p>day {feed.growingDay}</p>
                      </div>
                      <div className={`p-3 flex flex-col text-lg text-white font-bold justify-end h-full `}>
                        <button className={`rounded-lg`} style={{ backgroundColor: 'var(--main-color)' }} onClick={goDiarySet}>
                          관찰일지 보러가기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 포스트일 때 사진 */}
                {feed.imagePath ? (
                  <>
                    <div className={`relative`}>
                      <div className={`${styles.imageWarrper} flex justify-center`}>
                        {isLoadingErrorAtFeedImage && <Skeleton width={400} height={400} style={{ borderRadius: '30px' }} />}
                        <img
                          className='mb-3'
                          src={feed.imagePath}
                          alt='로고'
                          width='100%'
                          // height='450px'
                          onLoad={() => handleImageLoadAtFeedImage()}
                          onError={() => handleImageErrorAtFeedImage()}
                          style={{ display: isLoadingErrorAtFeedImage ? 'none' : 'block' }}></img>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            <div className={`flex justify-end pt-3`}>{getData(feed.createdAt)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
