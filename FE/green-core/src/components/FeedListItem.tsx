import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import styles from '@/styles/home/feed.module.scss';
import Skeleton from 'react-loading-skeleton';

import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { deleteDiary } from '@/core/diary/diaryAPI';
import { deletePost } from '@/core/post/postAPI';
import { FeedType } from '@/core/feed/feedType';
import CommentDeleteModal from '@/components/modal/CommentDeleteModal';
import { createLike, deleteLike } from '@/core/feed/feedAPI';
import { updateFollow, deleteFollow } from '@/core/follow/followAPI';
import { SET_SEARCH_TAG } from '@/core/search/searchSlice';

export default function FeedListItem(props: { feed: FeedType }) {
  const feed = props.feed;
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState<boolean>(feed.isLiked);
  const [likeCount, setLikeCount] = useState<number>(feed.likeCount);
  const [isfollowed, setIsFollowed] = useState<boolean>(feed.user.isFollowed);
  const [followerCount, setFollowerCount] = useState<number>(feed.user.followerCount);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isOpenFeedDeleteModal, setIsOpenFeedDeleteModal] = useState(false);
  const myNickname = useAppSelector((state) => state.common?.userInfo?.nickname);
  const reff = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const storage = getStorage();

  // 이미지 불러오기
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');
  /** 사용자 프로필 이미지 가져오는 함수 */

  // 태그 클릭 이벤트
  function handleTagClick(e) {
    const searchValue = e.target.innerText.slice(1);
    dispatch(SET_SEARCH_TAG(searchValue));
  }

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

      <div onClick={goDetail} className={`${styles.container} cursor-pointer flex border-b border-inherit 2xl:px-10 2xl:py-8 px-8 py-8`}>
        <div className={`flex flex-col`}>
          <div className={``}>
            {/* 프로필 사진 */}
            <div className={`${styles.helpTip} flex `}>
              <div onClick={goProfile} className={`overflow-hidden `}>
                {userProfileImagePath ? (
                  <Image
                    src={userProfileImagePath}
                    priority
                    className='rounded-full border border-2 border-black'
                    width={80}
                    height={80}
                    alt='profile image'></Image>
                ) : (
                  <Skeleton width={80} height={80} circle />
                )}
              </div>

              {/* 프로필 팝업 */}
              <div className={`flex flex-col div ${styles.userInfo}`}>
                <div className={`flex`}>
                  <div className={`flex flex-col justify-center items-center mr-5 overflow-hidden`}>
                    {isLoadingErrorAtProfileImage && <Skeleton width={80} height={80} circle />}
                    <Image
                      priority
                      onClick={goProfile}
                      className='rounded-full border border-2 border-black'
                      src={userProfileImagePath ? userProfileImagePath : '/images/noProfile.png'}
                      alt='로고'
                      width={80}
                      height={80}
                      style={{ display: isLoadingErrorAtProfileImage ? 'none' : 'block', cursor: 'pointer' }}></Image>
                  </div>

                  <div className='flex flex-col justify-center items-center'>
                    <div className='text-xl font-bold'>
                      <span>{feed.user.nickname || <Skeleton width={50} />}</span>
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
          <div className={`flex justify-center items-center space-x-2 my-3`}>
            {isLiked
              ? (
                  <span className={`material-symbols-outlined fill like`} onClick={handleDeleteLike}>
                    favorite
                  </span>
                ) || <Skeleton />
              : (
                  <span className='material-symbols-outlined' style={{ cursor: 'pointer' }} onClick={handlePostLike}>
                    favorite
                  </span>
                ) || <Skeleton />}
            <div className=''>{likeCount}</div>
          </div>

          {/* 댓글 */}
          <div className='flex justify-center items-center space-x-2'>
            <span className={`material-symbols-outlined `}>chat</span>
            <div>{feed.commentCount}</div>
          </div>
        </div>

        <div className={`flex flex-col w-full`}>
          <div className={`font-bold flex justify-between relative`}>
            {/* 닉네임 */}
            <span className={`${styles.nickname} ml-4`}>{feed.user.nickname}</span>

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

          <div className={`flex justify-between mx-4`}>
            <div className='space-x-2'>
              {feed?.tags?.map((tag: string, index: number) => {
                return (
                  <span key={index} onClick={handleTagClick} className={`${styles.tagBtn}`}>
                    #{tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 내용 */}
          <div className='mx-5 space-y-4'>
            <div className={`${styles.content} h-30`}>{feed.content}</div>
            <div>
              {feed.feedCode === 'FEED_DIARY' ? (
                <>
                  {/* 다이어리일때 사진 */}
                  <div className={`relative`}>
                    <div className={`${styles.imageWarrper} flex justify-center  border border-2 border-black`}>
                      {isLoadingErrorAtFeedImage && <Skeleton width={400} height={400} />}
                      <img
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
                          {isLoadingErrorAtFeedImage && <Skeleton width={400} height={400} />}
                          <div className='w-full h-96 bg-center'>
                            <Image
                              src={feed.imagePath}
                              alt='로고'
                              width={400}
                              height={400}
                              className='w-full h-full'
                              style={{ borderRadius: '2px' }}
                              onLoad={() => handleImageLoadAtFeedImage()}
                              onError={() => handleImageErrorAtFeedImage()}></Image>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>

          {/* createAt */}
          <div className='relative mt-5 text-xs text-gray-500'>
            <div className='absolute -right-2'>{getData(feed.createdAt)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
