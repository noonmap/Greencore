import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import styles from '@/styles/user/feed.module.scss';
import UserFeedProfile from '@/components/UserFeedProfile';
import UserFeedPlant from '@/components/UserFeedPlant';
import UserFeedDiarySet from '@/components/UserFeedDiarySet';
import UserFeedPost from '@/components/UserFeedPost';
import { useAppDispatch } from '@/core/hooks';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';

export default function FeedDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { nickname } = router.query;

  // searchState 변경

  useEffect(() => {
    changeSearchState();
  }, []);

  function changeSearchState() {
    dispatch(SET_IS_SEARCH_STATE('default'));
  }

  return (
    <AppLayout>
      <div className='space-y-2 px-4 py-4'>
        {/* 타이틀 */}
        <div className={`${styles.title} py-1`}>프로필</div>

        <div className={`overflow-x-hidden`}>
          {nickname ? (
            <div className={`space-y-5`}>
              {/* 프로필 라인 */}
              <UserFeedProfile nickname={nickname} />

              {/* 키우는 식물 라인 */}
              <UserFeedPlant nickname={nickname} />

              {/* 관찰일지 라인 */}
              <UserFeedDiarySet nickname={nickname} />

              {/* 포스트 라인 */}
              <UserFeedPost nickname={nickname} />
            </div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
