import React, { useEffect, useRef, useState } from 'react';
import FeedCommentItem from './FeedCommentItem';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/core/hooks';
import { createComment, getCommentList, getUserList } from '@/core/feed/feedAPI';
import styles from './FeedCommentList.module.scss';
import AppButton from './button/AppButton';
import { checkInputFormToast } from '@/lib/utils';

export default function FeedCommentList({ feedId }) {
  const [commentList, setCommentList] = useState([]);

  // GET 요청 변수
  const [isStop, setIsStop] = useState(false);
  const size = useRef<number>(3);
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

  useEffect(() => {
    watch();
    return () => {};
  });

  // 댓글 3개씩 리스트 받아오기
  const handleGetCommentList = async () => {
    if (!isStop) {
      const requestData = { feedId, page: page.current, size: size.current };
      const data = await dispatch(getCommentList(requestData));
      try {
        if (data.payload.result === 'SUCCESS') {
          if (data.payload.data.content.length < 3) {
            setIsStop(true);
          }
          if (page.current === 0) {
            setCommentList([...data.payload.data.content]);
          } else {
            setCommentList((prev) => [...prev, ...data.payload.data.content]);
          }
          page.current += 1;
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const lastAtSignIndex = content.lastIndexOf('@');
    console.log(lastAtSignIndex);
    if (lastAtSignIndex !== -1 && content.length > lastAtSignIndex + 1) {
      console.log(content.length, lastAtSignIndex + 1);
      const nickname = content.slice(lastAtSignIndex + 1);
      getUserList(nickname).then((res) => {
        console.log(res.data);
        setValue('userList', res.data.nickname);
      });
    }
  }, [content]);

  const handleUserSelect = (user: { name: string }) => {
    setValue('content', content.replace(/@\w+$/, `@${user.name} `));
    setValue('userList', []);
  };

  // 댓글 생성
  const handleCreateComment = async (e: any) => {
    e.preventDefault();
    const mentionRegex = /@[^\s@]+/g;
    // const mentionNickname = content.match(mentionRegex) || [];
    const mentionNickname = null;

    if (content == '') {
      checkInputFormToast();
      return;
    }

    const payload = { content, mentionNickname };
    const requestData = { feedId, payload };

    const data = await dispatch(createComment(requestData));
    if (data.payload.result === 'SUCCESS') {
      setValue('content', '');
      page.current = 0;
      handleGetCommentList();
    }
  };

  // 댓글 삭제
  const deleteCommentList = (commentId: number) => {
    let filteredCommentList = commentList.filter((item) => item.commentId !== commentId);
    setCommentList(filteredCommentList);
  };

  useEffect(() => {
    handleGetCommentList();
  }, []);

  return (
    <>
      <div className={`${styles.inputBox}`}>
        <textarea className={`${styles.textareaBox}`} rows={2} {...register('content')} />
        <ul>
          {userList.map((user) => (
            <li key={user.id} onClick={() => handleUserSelect(user)}>
              {user.name}
            </li>
          ))}
        </ul>
        <AppButton text='작성' className={`${styles.btn}`} handleClick={handleCreateComment} />
      </div>
      {commentList.map((comment) => {
        return <FeedCommentItem key={comment.commentId} comment={comment} feedId={feedId} deleteCommentList={deleteCommentList} />;
      })}
      {!isStop ? (
        <AppButton text='더보기' handleClick={handleGetCommentList} className='mt-4' />
      ) : (
        <AppButton text='더 이상 불러올 댓글이 없습니다' bgColor='thin' handleClick={handleGetCommentList} className='mt-4' />
      )}
    </>
  );
}
