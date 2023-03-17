import React, { useEffect, useRef, useState } from 'react';
import http from '@/lib/http.js';
import FeedCommentItem from './FeedCommentItem';
import { useForm } from 'react-hook-form';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';

export default function FeedCommentList(feedId: any) {
  const [commentList, setCommentList] = useState([]);
  const [isStop, setIsStop] = useState(false);
  // const [page, setPage] = useState(0);
  const page = useRef<number>(0);

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
  const getCommentList = async () => {
    if (!isStop) {
      try {
        const { data }: any = await http.get(`/feed/${feedId}/comment?page=${page.current}&size=3`);

        if (data.result === 'SUCCESS') {
          if (data.data.length < 3) {
            setIsStop(true);
          }
          setCommentList((prev) => [...prev, ...data.data]);
          // setPage((prev) => prev + 1);
          page.current += 1;
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 댓글 초기화
  const initComment = () => {
    page.current = 0;
    setCommentList([]);
  };

  // 댓글 생성
  const createComment = async (e: any) => {
    e.preventDefault();
    const mentionRegex = /@[^\s@#]+/g;
    const mentionNickname = content.match(mentionRegex) || [];

    const payload = { content, mentionNickname };
    console.log(payload);

    const { data } = await http.post(`/feed/${feedId}/comment`, payload);
    if (data.result === 'SUCCESS') {
      setValue('content', '');
      initComment();
      getCommentList();
      Toastify({
        text: message.CreateCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.CreateCommentFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  };

  // 댓글 삭제
  const deleteComment = (commentId: number) => {
    let filteredCommentList = commentList.filter((item) => item.commentId !== commentId);
    setCommentList(filteredCommentList);
  };

  useEffect(() => {
    getCommentList();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <textarea cols={50} rows={3} {...register('content')} />
        <button style={{ paddingInline: '4px' }} onClick={createComment}>
          댓글 작성
        </button>
      </div>
      {commentList.map((comment) => {
        return <FeedCommentItem key={comment.commentId} comment={comment} feedId={feedId} deleteComment={deleteComment} />;
      })}
      {!isStop && <button onClick={getCommentList}>더보기</button>}
    </div>
  );
}
