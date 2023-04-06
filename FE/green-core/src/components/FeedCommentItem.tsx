import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { deleteComment, getUserList, updateComment } from '@/core/feed/feedAPI';
import styles from './FeedCommentItem.module.scss';
import AppButton from './button/AppButton';
import CommentDeleteModal from './modal/CommentDeleteModal';
import { checkInputFormToast, getTodayDate } from '@/lib/utils';
import Image from 'next/image';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Skeleton from 'react-loading-skeleton';
import { createAlert } from '@/core/alert/alertAPI';

type PropsType = {
  comment: any;
  feedId: number;
  deleteCommentList: any;
  feedType: string;
};

export default function FeedCommentItem({ comment, feedId, deleteCommentList, feedType }: PropsType) {
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenCommentDeleteModal, setIsOpenCommentDeleteModal] = useState(false);
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');
  const myNickname = useAppSelector((state) => state.common?.userInfo?.nickname);
  const realContent = useRef<string>(comment.content);
  const modalRef = useRef<HTMLDivElement>(null);
  const storage = getStorage();
  const dispatch = useAppDispatch();

  const [isEditPopUp, setIsEditPopUp] = useState<boolean>(false);
  const popUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleModalOutsideClick);
    document.addEventListener('mousedown', handlePopUpOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
      document.removeEventListener('mousedown', handlePopUpOutsideClick);
    };
  }, []);

  /** 팝업 바깥 클릭 시 */
  function handlePopUpOutsideClick(e) {
    if (popUpRef.current && !popUpRef.current.contains(e.target)) setIsEditPopUp(false);
  }

  // 모달 바깥 클릭 시
  function handleModalOutsideClick(e: any) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpenMenu(false);
    }
  }

  // react-hook-form 설정
  type StateType = {
    content: string;
    userList: Array<any>;
  };

  const initialState: StateType = {
    content: comment.content,
    userList: [],
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [content, userList] = getValues(['content', 'userList']);

  useEffect(() => {
    watch();
    getUserProfile(comment.user.nickname);

    document.addEventListener('mousedown', handleModalOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  // 멘션 적용
  useEffect(() => {
    const lastAtSignIndex = content.lastIndexOf('@');
    if (lastAtSignIndex !== -1 && content.length > lastAtSignIndex + 1) {
      const nickname = content.slice(lastAtSignIndex + 1);
      getUserList(nickname).then((res) => {
        setValue('userList', res.data);
      });
    } else {
      setValue('userList', []);
    }
  }, [content]);

  // 멘션 추출하기
  const handleUserSelect = (user: { nickname: string }) => {
    const lastAtSignIndex = content.lastIndexOf('@');
    setValue('content', content.slice(0, lastAtSignIndex) + `@${user.nickname} `);
    setValue('userList', []);
  };

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
    setValue('content', realContent.current);
    setIsEditPopUp(false);
  };

  // 댓글 수정
  const handleUpdateComment = async () => {
    const mentionNickname = null;
    const mentionRegex = /@[^\s@]+/g;
    const mentionNicknameList = content.match(mentionRegex) || []; // 언급할 대상들

    if (content == '') {
      checkInputFormToast();
      return;
    }

    if (content === realContent.current) {
      setIsUpdated((prev) => !prev);
      return;
    }

    const payload = { content, mentionNickname };
    const requestData = { feedId: Number(feedId), commentId: Number(comment.commentId), payload };

    const data = await dispatch(updateComment(requestData));
    if (data.payload.result === 'SUCCESS') {
      realContent.current = content;
      setIsUpdated((prev) => !prev);
      for (const nickname of mentionNicknameList) {
        await mentionAlertFunction(nickname.substring(1));
      }
    }
  };

  // 언급 알림 함수
  const mentionAlertFunction = async (nickname: string) => {
    if (nickname !== myNickname) {
      const payload = {
        nickname,
        mentionNickname: myNickname,
        type: 'ALERT_MENTION',
        urlPath: `/${feedType}/${feedId}`,
        createdAt: getTodayDate(),
        isRead: false,
      };
      await dispatch(createAlert(payload));
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async () => {
    const requestData = { feedId: Number(feedId), commentId: Number(comment.commentId) };
    const data = await dispatch(deleteComment(requestData));
    if (data.payload.result === 'SUCCESS') {
      deleteCommentList();
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
      <div key={comment.commentId} className={`${styles.container} `}>
        <div>
          <Link href={`/user/feed/${comment.user.nickname}`}>
            {userProfileImagePath ? (
              <Image
                priority
                src={userProfileImagePath}
                alt='프로필사진'
                className='border border-2 border-black rounded-full'
                width={50}
                height={50}
                style={{ width: '50px', height: '50px' }}
              />
            ) : (
              <Skeleton width={50} height={50} style={{ width: '50px', height: '50px' }} circle />
            )}
          </Link>
        </div>
        {isUpdated ? (
          <div className={`flex items-center flex-1`}>
            <div className={`${styles.name} ml-1`}>
              <Link href={`/user/feed/${comment.user.nickname}`}>{comment.user.nickname}</Link>
            </div>
            <div className={`flex-1 `}>
              <textarea rows={1} {...register('content')} />
              {!userList ||
                (userList.length > 0 &&
                  userList.map((user) => (
                    <div key={user.userId} onClick={() => handleUserSelect(user)} className={`${styles.dropdownMenu}`}>
                      {user.nickname}
                    </div>
                  )))}
            </div>
          </div>
        ) : (
          <div className={`flex items-center flex-1 mx-2`}>
            <div className='flex-1'>
              <div className='flex items-center'>
                <div className={`${styles.name} text-sm mr-1`}>
                  <Link href={`/user/feed/${comment.user.nickname}`}>{comment.user.nickname}</Link>
                </div>
                <div className={`${styles.date} text-xs`}>{elapsedTime(comment.createdAt)}</div>
              </div>
              <div className={`${styles.introduction} `}>
                {content.split(/(@[^\s@#]+)/g).map((v: string, index: number) => {
                  if (v.match(/@[^\s@#]+/g)) {
                    return (
                      <span key={index}>
                        <Link href={`/user/feed/${v.substring(1)}`} style={{ color: 'blue', whiteSpace: 'pre-line' }}>
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
            </div>
          </div>
        )}

        {myNickname === comment.user.nickname ? (
          <>
            {isUpdated ? (
              <>
                <AppButton text='수정' className={`${styles.btn} mb-1`} handleClick={handleUpdateComment} />
                <AppButton text='취소' className={`${styles.btn}`} handleClick={handleUpdateCommentToggle} bgColor='thin' />
              </>
            ) : (
              <>
                <span className='material-symbols-outlined cursor-pointer md' style={{ fontSize: '1.3rem' }} onClick={() => setIsEditPopUp(true)}>
                  more_vert
                </span>

                {isEditPopUp ? (
                  <div className='relative' ref={popUpRef}>
                    <div className={`popUp ${styles.popUp}`}>
                      <div onClick={handleUpdateCommentToggle}>수정</div>
                      <div
                        onClick={() => {
                          setIsOpenCommentDeleteModal(true);
                          setIsEditPopUp(false);
                        }}>
                        삭제
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : null}

        {/* {myNickname === comment.user.nickname && (
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
        )} */}
      </div>
    </>
  );
}
