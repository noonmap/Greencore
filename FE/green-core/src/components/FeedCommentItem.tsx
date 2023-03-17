import http from '@/lib/http';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';

export default function FeedCommentItem({ comment, feedId, deleteComment }) {
  const [isUpdated, setIsUpdated] = useState(false);

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
    return () => {};
  });

  // 댓글 수정 토글
  const handleUpdateComment = (e: any) => {
    e.preventDefault();
    setIsUpdated((prev) => !prev);
  };

  // 댓글 수정 확인
  const checkUpdateComment = () => {
    if (window.confirm('수정하시겠습니까?')) {
      updateComment();
    }
  };

  // 댓글 수정
  const updateComment = async () => {
    const mentionRegex = /@[^\s@#]+/g;
    const mentionNickname = content.match(mentionRegex) || [];

    const payload = { content, mentionNickname };
    console.log(payload);
    const { data } = await http.put(`/feed/${feedId}/comment/${comment.commentId}`, payload);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.UpdateCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.UpdateCommentFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
    setIsUpdated((prev) => !prev);
  };

  // 댓글 삭제 확인
  const checkDeleteComment = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      handleDeleteComment();
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async () => {
    const { data } = await http.delete(`/feed/${feedId}/comment/${comment.commentId}`);
    if (data.result === 'SUCCESS') {
      deleteComment(comment.commentId);
      Toastify({
        text: message.DeleteCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.DeleteCommentFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  };

  return (
    <div key={comment.commentId} style={{ display: 'flex', marginBlock: '16px' }}>
      <div>
        <img src={comment.user.profileImagePath} alt='프로필사진' style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      </div>
      {isUpdated ? (
        <div>
          <textarea rows={4} {...register('content')} />
        </div>
      ) : (
        <div>
          <div>{comment.user.nickname}</div>
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
          <div>{comment.createdAt.slice(0, 10)}</div>
          <div>{comment.createdAt.slice(11, 16)}</div>
        </div>
      )}
      {isUpdated ? (
        <div>
          <button style={{ paddingInline: '4px' }} onClick={checkUpdateComment}>
            수정
          </button>
          <button style={{ paddingInline: '4px' }} onClick={handleUpdateComment}>
            취소
          </button>
        </div>
      ) : (
        <div>
          <button style={{ paddingInline: '4px' }} onClick={handleUpdateComment}>
            수정
          </button>
          <button style={{ paddingInline: '4px' }} onClick={checkDeleteComment}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
