import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { deleteComment, updateComment } from '@/core/feed/feedAPI';
import styles from './FeedCommentItem.module.scss';
import AppButton from './button/AppButton';
import CommentDeleteModal from './modal/CommentDeleteModal';
import { checkInputFormToast } from '@/lib/utils';
import Image from 'next/image';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Skeleton from 'react-loading-skeleton';

export default function FeedCommentItem({ comment, feedId, deleteCommentList }) {
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenCommentDeleteModal, setIsOpenCommentDeleteModal] = useState(false);
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');
  const { nickname: myNickname } = useAppSelector((state) => state.common?.userInfo);
  const modalRef = useRef<HTMLDivElement>(null);
  const storage = getStorage();
  const dispatch = useAppDispatch();

  // 모달 바깥 클릭 시
  function handleModalOutsideClick(e: any) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpenMenu(false);
    }
  }

  // react-hook-form 설정
  type StateType = {
    content: string;
  };

  const initialState: StateType = {
    content: comment.content,
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [content] = getValues(['content']);

  useEffect(() => {
    watch();
    getUserProfile(comment.user.nickname);

    document.addEventListener('mousedown', handleModalOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  });

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

  // 댓글 수정 토글
  const handleUpdateCommentToggle = (e: any) => {
    e.preventDefault();
    setIsOpenMenu(false);
    setIsUpdated((prev) => !prev);
  };

  // 댓글 수정
  const handleUpdateComment = async () => {
    const mentionRegex = /@[^\s@#]+/g;
    const mentionNickname = null;

    if (content == '') {
      checkInputFormToast();
      return;
    }

    const payload = { content, mentionNickname };
    const requestData = { feedId: Number(feedId), commentId: Number(comment.commentId), payload };

    const data = await dispatch(updateComment(requestData));
    setIsUpdated((prev) => !prev);
  };

  // 댓글 삭제
  const handleDeleteComment = async () => {
    const requestData = { feedId: Number(feedId), commentId: Number(comment.commentId) };
    const data = await dispatch(deleteComment(requestData));
    if (data.payload.result === 'SUCCESS') {
      deleteCommentList(comment.commentId);
    }
  };

  // 시간 포맷
  const elapsedTime = (date: any) => {
    const start = +new Date(date);
    const end = +new Date();

    const diff = (end - start) / 1000;

    const times = [
      { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
      { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
      { name: '일', milliSeconds: 60 * 60 * 24 },
      { name: '시간', milliSeconds: 60 * 60 },
      { name: '분', milliSeconds: 60 },
    ];

    for (const value of times) {
      const betweenTime = Math.floor(diff / value.milliSeconds);

      if (betweenTime > 0) {
        return `${betweenTime}${value.name} 전`;
      }
    }
    return '방금 전';
  };

  return (
    <>
      {isOpenCommentDeleteModal && (
        <CommentDeleteModal
          isOpen={isOpenCommentDeleteModal}
          modalTitle='댓글 삭제'
          handleDelete={handleDeleteComment}
          handleModalClose={() => setIsOpenCommentDeleteModal(false)}
        />
      )}
      <div key={comment.commentId} className={`${styles.container}`}>
        <div>
          <Link href={`/user/feed/${comment.user.nickname}`}>
            {userProfileImagePath ? (
              <Image
                src={userProfileImagePath}
                alt='프로필사진'
                width={100}
                height={100}
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
            ) : (
              <Skeleton width={50} height={50} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            )}
          </Link>
        </div>
        {isUpdated ? (
          <div className={`flex items-center flex-1`}>
            <div className={`${styles.name} w-12 mx-4`}>
              <Link href={`/user/feed/${comment.user.nickname}`}>{comment.user.nickname}</Link>
            </div>
            <textarea className={`${styles.textareaBox} flex-1`} rows={2} {...register('content')} />
          </div>
        ) : (
          <div className={`flex items-center flex-1`}>
            <div className={`${styles.name} w-12 mx-4`}>
              <Link href={`/user/feed/${comment.user.nickname}`}>{comment.user.nickname}</Link>
            </div>
            <div className='flex-1'>
              <div>
                {content.split(/(@[^\s@#]+)/g).map((v: string, index: number) => {
                  if (v.match(/@[^\s@#]+/g)) {
                    return (
                      <span key={index}>
                        <Link href={`/user/feed/${comment.user.nickname}`} style={{ color: 'blue', whiteSpace: 'pre-line' }}>
                          {v}
                        </Link>
                      </span>
                    );
                  }
                  return (
                    <span key={index} style={{ whiteSpace: 'pre-line' }}>
                      {v}
                    </span>
                  );
                })}
              </div>
              <div className={`${styles.date}`}>{elapsedTime(comment.createdAt)}</div>
            </div>
          </div>
        )}
        {myNickname === comment.user.nickname && (
          <div className={`${styles.end}`}>
            {isUpdated ? (
              <>
                <AppButton text='수정' className={`${styles.btn} mb-1`} handleClick={handleUpdateComment} />
                <AppButton text='취소' className={`${styles.btn}`} handleClick={handleUpdateCommentToggle} bgColor='thin' />
              </>
            ) : (
              <>
                <span className='material-symbols-outlined cursor-pointer' onClick={() => setIsOpenMenu((prev) => !prev)}>
                  more_vert
                </span>
                <div className={`${styles.dropdown}`}>
                  <div ref={modalRef} className={`${isOpenMenu ? styles.editPopUp : 'hidden'} rounded-xl overflow-hidden`}>
                    <div
                      className={`border-b border-slate-300 bg-white flex justify-center items-center cursor-pointer ${styles.dropdownMenu}`}
                      onClick={handleUpdateCommentToggle}>
                      <span className='text-lg p-2'>수정</span>
                      <span className='material-symbols-outlined'>edit</span>
                    </div>
                    <div
                      className={`border-b border-slate-300 bg-white flex justify-center items-center text-red-400 cursor-pointer ${styles.dropdownMenu}`}
                      onClick={() => setIsOpenCommentDeleteModal(true)}>
                      <span className='text-lg p-2'>삭제</span>
                      <span className='material-symbols-outlined'>delete</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
