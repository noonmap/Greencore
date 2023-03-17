import React from 'react';
import AppLayout from '@/layout/AppLayout';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import http from '@/lib/http.js';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { useInput } from '@/core/hooks';
import FeedCommentList from '@/components/FeedCommentList';

// const fetcher = (url: string) => fetch(url).then((res) => res.json());
const fetcher = (url: string) => http.get(url).then((res) => res.data);

export default function DiaryDetail() {
  const router = useRouter();
  const diaryId = Number(router.query.diaryId); // number
  const { data: diary, error, isLoading: hasDiary } = useSWR(`/diary/${diaryId}`, fetcher);
  const [text, onChangeText] = useInput('');

  // 삭제 확인
  const checkDeleteDiary = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      handleDeleteDiary();
    }
  };

  // 삭제
  const handleDeleteDiary = async () => {
    try {
      const { data } = await http.delete(`/diary/${diaryId}`);
      if (data.result === 'SUCCESS') {
        router.push('/diary');
        Toastify({
          text: message.DeleteDiarySuccess,
          duration: 1000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.DeleteDiaryFail,
          duration: 1000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 뒤로가기
  const handleGoBack = () => {
    router.back();
  };

  return (
    <AppLayout>
      {hasDiary ? (
        <ul>
          <Skeleton width={150} height={150} />
          <Skeleton />
          <Skeleton />
        </ul>
      ) : (
        <div>
          <ul>
            <li>
              <img src={diary.data.imagePath} alt='img' width={150} height={150} />
            </li>
            <li>
              <div>
                {diary.data.tags.map((tag: string, i: number) => {
                  return (
                    <span key={i} style={{ marginInline: '1px' }}>
                      #{tag}
                    </span>
                  );
                })}
              </div>
            </li>
            <li>관찰일시 : {diary.data.observationDate}</li>
            <li>내용 : {diary.data.content}</li>
            <li>좋아요 : {diary.data.likeCount}</li>
          </ul>
          <Link href={`update/${diaryId}`}>
            <button>수정</button>
          </Link>
          <button onClick={checkDeleteDiary}>삭제</button>
          <button onClick={handleGoBack}>뒤로</button>
          <div>{!Number.isNaN(diaryId) && <FeedCommentList feedId={diaryId} />}</div>
        </div>
      )}
    </AppLayout>
  );
}
