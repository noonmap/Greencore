import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import http from '@/lib/http';
import Skeleton from 'react-loading-skeleton';

const fetcher = (url: string) => http.get(url).then((res) => res.data);

export default function PostDetail() {
  const router = useRouter();
  const diaryId = router.query.id; // string
  const { data: post, error, isLoading: hasPost } = useSWR(`/photos/${diaryId}`, fetcher);

  return (
    <AppLayout>
      {hasPost ? (
        <ul>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </ul>
      ) : (
        <ul>
          <li>
            <img src={post.thumbnailUrl} alt='img' />
          </li>
          <li>{post.albumId}</li>
          <li>{post.title}</li>
        </ul>
      )}
    </AppLayout>
  );
}
