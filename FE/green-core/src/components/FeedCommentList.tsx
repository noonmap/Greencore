import React, { useEffect, useRef, useState } from 'react';
import FeedCommentItem from './FeedCommentItem';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { createComment, getCommentList, getUserList } from '@/core/feed/feedAPI';
import styles from './FeedCommentList.module.scss';
import AppButton from './button/AppButton';
import { checkInputFormToast, getTodayDate } from '@/lib/utils';
import { createAlert } from '@/core/alert/alertAPI';

type PropsType = {
  feedId: number;
  setCommentCount: any;
  feedType: string;
  nickname: string;
};

export default function FeedCommentList({ feedId, setCommentCount, feedType, nickname }: PropsType) {
  const [commentList, setCommentList] = useState([]);
  const myNickname = useAppSelector((state) => state.common?.userInfo?.nickname);

  // GET 요청 변수
  const isStop = useRef<boolean>(false);
  const size = useRef<number>(5);
  const page = useRef<number>(0);
  const dispatch = useAppDispatch();

  // react-hook-form 설정
  type StateType = {
    content: string;
    userList: Array<any>;
  };

  const initialState: StateType = {
    content: '',
    userList: [],
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [content, userList] = getValues(['content', 'userList']);

  // 댓글 5개씩 리스트 받아오기
  const handleGetCommentList = async () => {
    if (!isStop.current) {
      const requestData = { feedId, page: page.current, size: size.current };
      try {
        const data = await getCommentList(requestData);
        console.log('댓글 가져옴', data.data.content); ////////////////////////////////////////////////////////////
        if (data.result === 'SUCCESS') {
          setCommentCount(data.data.totalElements);
          if (data.data.content.length < 5) {
            isStop.current = true;
          }
          if (page.current === 0) {
            setCommentList([...data.data.content]);
          } else {
            setCommentList((prev) => [...prev, ...data.data.content]);
          }
          page.current += 1;
        }
      } catch (err) {
        isStop.current = true;
        setCommentList((prev) => [...prev]);
      }
    }
  };

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

  // 댓글 생성 알림 함수
  const commentAlertFunction = async (nickname: string) => {
    if (nickname !== myNickname) {
      const payload = {
        nickname,
        mentionNickname: myNickname,
        type: 'ALERT_COMMENT',
        urlPath: `/${feedType}/${feedId}`,
        createdAt: getTodayDate(),
        isRead: false,
      };
      await dispatch(createAlert(payload));
    }
  };

  // 댓글 생성
  const handleCreateComment = async (e: any) => {
    e.preventDefault();
    const mentionRegex = /@[^\s@]+/g;
    const mentionNicknameList = content.match(mentionRegex) || []; // 언급할 대상들

    const mentionNickname = null;

    if (content == '') {
      checkInputFormToast();
      return;
    }

    const payload = { content, mentionNickname };
    const requestData = { feedId, payload };

    const data = await dispatch(createComment(requestData));
    if (data.payload.result === 'SUCCESS') {
      isStop.current = false;
      setValue('content', '');
      page.current = 0;
      handleGetCommentList();
      await commentAlertFunction(nickname);
      for (const nickname of mentionNicknameList) {
        await mentionAlertFunction(nickname.substring(1));
      }
    }
  };

  // 댓글 삭제
  const deleteCommentList = () => {
    isStop.current = false;
    setValue('content', '');
    page.current = 0;
    handleGetCommentList();
  };

  useEffect(() => {
    handleGetCommentList();
    console.log('요청은 보내냐?'); /////////////////////////////////////////
    watch();
    return () => setCommentList([]);
  }, [feedId]);

  return (
    <>
      <div className={`${styles.inputBox} flex-1`}>
        <div className={`${styles.textareaWrapper} flex items-center flex-1`}>
          <textarea rows={1} {...register('content')} className='w-full' />
          {!userList ||
            (userList.length > 0 &&
              userList.map((user) => (
                <div key={user.userId} onClick={() => handleUserSelect(user)} className={`${styles.dropdownMenu}`}>
                  {user.nickname}
                </div>
              )))}
        </div>
        <AppButton text='작성' className='ml-2' bgColor='yellow' handleClick={handleCreateComment} />
      </div>
      {commentList.map((comment) => {
        return (
          <FeedCommentItem key={comment.commentId} comment={comment} feedId={feedId} deleteCommentList={deleteCommentList} feedType={feedType} />
        );
      })}
      {!isStop.current ? (
        <AppButton text='더보기' handleClick={handleGetCommentList} className='mt-4' />
      ) : (
        <AppButton text='더 이상 불러올 댓글이 없습니다' bgColor='thin' className='my-4' handleClick={handleGetCommentList} />
      )}
    </>
  );
}
