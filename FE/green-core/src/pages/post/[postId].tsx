import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Skeleton from 'react-loading-skeleton';
import http from '@/lib/http';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import FeedCommentList from '@/components/FeedCommentList';
import styles from '@/styles/Diary.module.scss';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { deletePost } from '@/core/post/postAPI';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { createLike, deleteLike } from '@/core/feed/feedAPI';
import { deleteFollow, updateFollow } from '@/core/follow/followAPI';
import CommentDeleteModal from '@/components/modal/CommentDeleteModal';

const fetcher = (url: string) => http.get(url).then((res) => res.data);

export default function PostDetail() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const postId = Number(router.query.postId);
  const { data: post, error, isLoading: hasPost } = useSWR(`/post/${postId}`, fetcher);
  const [isOpenPostDeleteModal, setIsOpenPostDeleteModal] = useState(false);
  const { nickname: myNickname } = useAppSelector((state) => state.common?.userInfo);
  const ref = useRef<HTMLDivElement>(null);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isfollowed, setIsFollowed] = useState<boolean>(false);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // 바깥 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (event.target.innerText != 'more_vert') {
        setIsOpenMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {};
  }, []);

  // searchState 변경
  function changeSearchState() {
    dispatch(SET_IS_SEARCH_STATE('home'));
  }

  useEffect(() => {
    changeSearchState();
    if (!hasPost) {
      setIsLiked(post.data.isLiked);
      setLikeCount(post.data.likeCount);
      setIsFollowed(post.data.user.isFollowed);
      setFollowerCount(post.data.user.followingCount);
    }
  }, [hasPost]);

  // 포스트 삭제
  const handleDeletePost = () => {
    try {
      const requestData = { router, postId };
      dispatch(deletePost(requestData));
    } catch (err) {
      console.log(err);
    }
  };

  // 뒤로가기
  const handleGoBack = () => {
    router.push(`/home`);
  };

  // 좋아요
  function handlePostLike(e: any) {
    e.stopPropagation();
    createLike(postId).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    });
  }

  // 좋아요 취소
  function handleDeleteLike(e: any) {
    e.stopPropagation();
    deleteLike(postId).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    });
  }

  // 유저 팔로우
  function handleUserFollow(e: any) {
    e.stopPropagation();
    updateFollow(post.data.user.nickname).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsFollowed(true);
        setFollowerCount((prev) => prev + 1);
      }
    });
  }

  // 유저 팔로우 취소
  function handleDeleteFollow(e: any) {
    e.stopPropagation();
    deleteFollow(post.data.user.nickname).then((res) => {
      if (res.result === 'SUCCESS') {
        setIsFollowed(false);
        setFollowerCount((prev) => prev - 1);
      }
    });
  }

  // 시간 포맷
  const elapsedTime = (date: any) => {
    const created = new Date(date);

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
  };

  // 유저 프로필 이동
  const goProfile = () => {
    router.push(`/user/feed/${post.data.user.nickname}`);
  };

  return (
    <AppLayout>
      {isOpenPostDeleteModal && (
        <CommentDeleteModal
          isOpen={isOpenPostDeleteModal}
          modalTitle='게시글 삭제'
          handleDelete={handleDeletePost}
          handleModalClose={() => setIsOpenPostDeleteModal(false)}
        />
      )}
      {hasPost ? (
        <ul>
          <Skeleton width={150} height={150} />
          <Skeleton />
          <Skeleton />
        </ul>
      ) : (
        <div className={`${styles.container} overflow-auto flex-1 mx-auto pt-2 px-3`}>
          <div className={`${styles.title}`}>
            <span className={`material-symbols-outlined ${styles.backIcon} cursor-pointer`} onClick={handleGoBack}>
              arrow_back_ios
            </span>
            <div>게시글</div>
          </div>

          <div className='flex'>
            {/* 일지 작성자 정보 */}
            <div className='flex flex-col items-center'>
              <div className={`${styles.helpTip} flex`}>
                <img src={post?.data.user.profileImagePath} className={`${styles.profileImg}`} alt='프로필 이미지' onClick={goProfile} />

                {/* 프로필 팝업 */}
                <div className={`flex flex-col div ${styles.userInfo}`}>
                  <div className={`flex`}>
                    <div className={`flex flex-col justify-center items-center `}>
                      {post.data.user.profileImagePath ? (
                        <img src={post.data.user.profileImagePath} alt='프로필 이미지' className={`${styles.profileImg2} mb-3`} onClick={goProfile} />
                      ) : (
                        <Skeleton width={80} height={80} />
                      )}
                    </div>

                    <div className='flex flex-col justify-center items-center'>
                      <div className='text-xl font-bold'>
                        <span>{post.data.user.nickname || <Skeleton />}</span>
                      </div>
                      <div className='flex justify-center items-center text-sm'>
                        <div className='flex flex-col justify-center items-center w-20'>
                          <span>팔로워</span>
                          <span>{followerCount}</span>
                        </div>
                        <div className='flex flex-col justify-center items-center w-20'>
                          <span>팔로잉</span>
                          <span>{post.data.user.followingCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex py-5'>{post.data.user.introduction}</div>
                  <div className='flex justify-center rounded-lg overflow-hidden'>
                    {isfollowed ? (
                      <button className={`w-full `} onClick={handleDeleteFollow} style={{ backgroundColor: 'var(--thin-color)' }}>
                        팔로우 취소
                      </button>
                    ) : (
                      <button className={`text-white w-full`} onClick={handleUserFollow} style={{ backgroundColor: 'var(--main-color)' }}>
                        팔로우
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${styles.infoItem} flex`}>
                {isLiked ? (
                  <span className={`material-symbols-outlined ${styles.heart} cursor-pointer flex-1 text-right`} onClick={handleDeleteLike}>
                    favorite
                  </span>
                ) : (
                  <span className={`material-symbols-outlined cursor-pointer flex-1 text-right`} onClick={handlePostLike}>
                    favorite
                  </span>
                )}
                <div className='font-extrabold flex-1 flex justify-start ml-3'>{likeCount}</div>
              </div>
              <div className={`${styles.infoItem} flex`}>
                <span className={`material-symbols-outlined flex-1 flex text-right`}>chat</span>
                <div className='font-extrabold flex-1 flex justify-start ml-3'>{post.data.commentCount}</div>
              </div>
            </div>

            {/* 일지 정보 */}
            <div className={`${styles.subContainer} flex flex-1`} style={myNickname !== post.data.user.nickname ? { paddingRight: '24px' } : null}>
              <div className='flex-1 px-3'>
                <div className='flex justify-between mb-2'>
                  <div className={`${styles.nickname}`}>{post.data.user.nickname}</div>
                </div>
                <div className={`${styles.box}`}>
                  <img src={post?.data?.imagePath} alt='img' className={`${styles.image}`} />
                </div>
                <div className='flex justify-between mb-2'>
                  <div className={`${styles.tags} flex flex-wrap flex-1 mr-5`}>
                    {post?.data?.tags.map((tag: string, index: number) => {
                      return (
                        // <Link href={``} key={index} style={{ marginInline: '1px' }}>
                        // </Link>

                        // 여기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 태그 검색 만들어야됨!!!!!!!!!!!!!!

                        <span key={index}>{tag}</span>
                      );
                    })}
                  </div>
                  <div className='w-fit'>{elapsedTime(post?.data?.createdAt)}</div>
                </div>
                <div className='mb-7'>{post?.data?.content}</div>

                {/* 댓글 컴포넌트 */}
                <div>{!Number.isNaN(postId) && <FeedCommentList feedId={postId} />}</div>
              </div>

              {/* 옵션 버튼 */}
              {myNickname === post.data.user.nickname && (
                <>
                  <span className='material-symbols-outlined cursor-pointer h-fit' onClick={() => setIsOpenMenu((prev) => !prev)}>
                    more_vert
                  </span>
                  <div className={`${styles.dropdown}`}>
                    <div ref={ref} className={`${isOpenMenu ? styles.editPopUp : 'hidden'} rounded-xl overflow-hidden`}>
                      <div
                        className={`border-b border-slate-300 bg-white flex justify-center items-center cursor-pointer ${styles.dropdownMenu}`}
                        onClick={() => {
                          router.push(`update/${postId}`);
                        }}>
                        <span className='text-lg p-2'>수정</span>
                        <span className='material-symbols-outlined'>edit</span>
                      </div>
                      <div
                        className={`border-b border-slate-300 bg-white flex justify-center items-center text-red-400 cursor-pointer ${styles.dropdownMenu}`}
                        onClick={() => setIsOpenPostDeleteModal(true)}>
                        <span className='text-lg p-2'>삭제</span>
                        <span className='material-symbols-outlined'>delete</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
