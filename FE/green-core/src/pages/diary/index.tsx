import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getDiaryList } from '~/src/core/diary/diaryAPI';
import DiaryListItem from '@/components/DiaryListItem';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function diary() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.diary.isLoading);
  const diaryList = useAppSelector((state) => state.diary.diaryList);
  const diarySet = useAppSelector((state) => state.diary.diarySet);

  useEffect(() => {
    const diarySetId: number = 0;
    dispatch(getDiaryList(diarySetId));
    if (!isLoading) {
    }

    return () => {
      console.log('unmounted');
    };
  }, []);

  return (
    <AppLayout>
      <Link href={'diary/create'}>
        <button className='bg-blue-500 rounded ml-6'>일지 생성</button>
      </Link>
      <div className='mx-auto max-w-7xl p-6 lg:px-8'>
        {isLoading ? (
          new Array(10).fill(1).map((_, i) => {
            return <DiaryListItem key={i} />;
          })
        ) : (
          <div>
            <div>제목 : {diarySet.title}</div>
            <div style={{ display: 'flex' }}>
              <img src={diarySet.user.profileImagePath} style={{ borderRadius: '100%', width: '50px', height: '50px' }} />
              <div>식집사 : {diarySet.user.nickname}</div>
            </div>
            <div>관찰 시작 : {diarySet.startDate}</div>
            <div>
              {diaryList.map((diary) => (
                <DiaryListItem key={diary.diaryId} diary={diary} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
