import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import styles from '@/styles/UserFeed.module.scss';
import UserFeedProfile from '@/components/UserFeedProfile';
import UserFeedPlant from '@/components/UserFeedPlant';
import UserFeedDiarySet from '@/components/UserFeedDiarySet';
import UserFeedPost from '@/components/UserFeedPost';

export default function FeedDetail() {
  const router = useRouter();
  const { nickname } = router.query;

  return (
    <AppLayout>
      <div className='space-y-2 px-3 py-5'>
        {/* 타이틀 */}
        <h1 className='main'>프로필</h1>

        <div className={`${styles.wrap}`}>
          <div className={`${styles.content} space-y-5`}>
            {/* 프로필 라인 */}
            <UserFeedProfile />

            {/* 키우는 식물 라인 */}
            <UserFeedPlant nickname={nickname} />

            {/* 관찰일지 라인 */}
            <UserFeedDiarySet />

            {/* 포스트 라인 */}
            <UserFeedPost />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
