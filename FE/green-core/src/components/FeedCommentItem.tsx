import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/core/hooks';
import { deleteComment, updateComment } from '@/core/feed/feedAPI';

export default function FeedCommentItem({ comment, feedId, deleteCommentList }) {
  const [isUpdated, setIsUpdated] = useState(false);
  const dispatch = useAppDispatch();

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
  const handleUpdateCommentToggle = (e: any) => {
    e.preventDefault();
    setIsUpdated((prev) => !prev);
  };

  // 댓글 수정 확인
  const checkUpdateComment = () => {
    if (window.confirm('수정하시겠습니까?')) {
      handleUpdateComment();
    }
  };

  // 댓글 수정
  const handleUpdateComment = async () => {
    const mentionRegex = /@[^\s@#]+/g;
    const mentionNickname = content.match(mentionRegex) || [];

    const payload = { content, mentionNickname };
    const requestData = { feedId: Number(feedId), commentId: Number(comment.commentId), payload };
    const data = await dispatch(updateComment(requestData));
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
    const requestData = { feedId: Number(feedId), commentId: Number(comment.commentId) };
    const data = await dispatch(deleteComment(requestData));
    if (data.payload.result === 'SUCCESS') {
      deleteCommentList(comment.commentId);
    }
  };

  return (
    <div key={comment.commentId} style={{ display: 'flex', marginBlock: '16px' }}>
      <div>
        <Link href={`/user/feed/${comment.user.nickname}`}>
          <img src={comment.user.profileImagePath} alt='프로필사진' style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </Link>
      </div>
      {isUpdated ? (
        <div>
          <textarea rows={4} {...register('content')} />
        </div>
      ) : (
        <div>
          <div>
            <Link href={`/user/feed/${comment.user.nickname}`}>{comment.user.nickname}</Link>
          </div>
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
          <div>
            {comment.createdAt.slice(0, 10)} {comment.createdAt.slice(11, 16)}
          </div>
        </div>
      )}
      {isUpdated ? (
        <div>
          <button style={{ paddingInline: '4px' }} onClick={checkUpdateComment}>
            수정
          </button>
          <button style={{ paddingInline: '4px' }} onClick={handleUpdateCommentToggle}>
            취소
          </button>
        </div>
      ) : (
        <div>
          <button style={{ paddingInline: '4px' }} onClick={handleUpdateCommentToggle}>
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
