import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '../core/hooks';
import { getDiaryList } from '@/core/temp/diary/diaryAPI';
import DiaryListItem from '../components/DiaryListItem';

export default function diary() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.diary.isLoading);
  const diaryList = useAppSelector((state) => state.diary.diaryList);

  useEffect(() => {
    dispatch(getDiaryList());

    if (!isLoading) {
      console.log(diaryList[0].id);
    }

    return () => {
      console.log('unmounted');
    };
  }, []);

  return (
    <AppLayout>
      <div className='mx-auto max-w-7xl p-6 lg:px-8'>
        {isLoading ? (
          new Array(10).fill(1).map((_, i) => {
            return <DiaryListItem key={i} />;
          })
        ) : (
          <div>
            {diaryList.map((diary) => (
              <DiaryListItem key={diary.id} diary={diary} id={diary.id} title={diary.title} url={diary.url} thumbnailUrl={diary.thumbnailUrl} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
