import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import http from '@/lib/http.js';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

// const fetcher = (url: string) => fetch(url).then((res) => res.json());
const fetcher = (url: string) => http.get(url).then((res) => res.data);

export default function DiaryDetail() {
  const router = useRouter();
  const diaryId = router.query.diaryId; // string
  const { data: diary, error, isLoading: hasDiary } = useSWR(`/diary/diaryDetail/${diaryId}`, fetcher);
  return (
    <AppLayout>
      {hasDiary ? (
        <ul>
          <Skeleton width={150} height={150} />
          <Skeleton />
          <Skeleton />
        </ul>
      ) : (
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
      )}
    </AppLayout>
  );
}
