import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import { getProfile } from '@/core/user/userAPI';

export default function FeedDetail() {
  const router = useRouter();
  const { nickname } = router.query;

  const getUserProfile = useCallback(async () => {
    const { data } = await getProfile(nickname);
    console.log(data);
  }, [nickname]);

  useEffect(() => {
    if (!router.isReady) return;
    getUserProfile();
    return () => {};
  }, [nickname]);

  return (
    <AppLayout>
      <h1>User Feed</h1>

      <div>프로필 라인</div>
      <div>내키식 라인</div>
      <div>관찰일지 라인</div>
      <div>포스트 라인</div>
    </AppLayout>
  );
}
