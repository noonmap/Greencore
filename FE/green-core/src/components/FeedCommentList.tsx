import React, { useEffect, useRef, useState } from 'react';
import FeedCommentItem from './FeedCommentItem';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/core/hooks';
import { createComment, getCommentList } from '@/core/feed/feedAPI';

export default function FeedCommentList(feedId: any) {
  const [commentList, setCommentList] = useState([]);
  const [isStop, setIsStop] = useState(false);
  const size = useRef<number>(3);
  const page = useRef<number>(0);
  const dispatch = useAppDispatch();

  // react-hook-form 설정
  type StateType = {
    content: string;
  };

  const initialState: StateType = {
    content: '',
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [content] = getValues(['content']);

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
          if (data.payload.data.length < 3) {
            setIsStop(true);
          }
          if (page.current === 0) {
            setCommentList([...data.payload.data]);
          } else {
            setCommentList((prev) => [...prev, ...data.payload.data]);
          }
          page.current += 1;
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 댓글 생성
  const handleCreateComment = async (e: any) => {
    e.preventDefault();
    const mentionRegex = /@[^\s@#]+/g;
    const mentionNickname = content.match(mentionRegex) || [];

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
    <div>
      <div style={{ display: 'flex' }}>
        <textarea cols={50} rows={3} {...register('content')} />
        <button style={{ paddingInline: '4px' }} onClick={handleCreateComment}>
          댓글 작성
        </button>
      </div>
      {commentList.map((comment) => {
        return <FeedCommentItem key={comment.commentId} comment={comment} feedId={feedId} deleteCommentList={deleteCommentList} />;
      })}
      {!isStop && <button onClick={handleGetCommentList}>더보기</button>}
    </div>
  );
}
