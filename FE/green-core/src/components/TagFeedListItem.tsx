import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { TagFeedType } from '../core/feed/feedType';
import styles from '@/styles/feed.module.scss';

export default function TagFeedListItem(props: { tagFeed: TagFeedType }) {
  const tagFeed = props.tagFeed;

  return (
    <>
      <div key={tagFeed.feedId} className={`${styles.feedContainer} bg-green-300`}>
        <div>{tagFeed.feedId || <Skeleton />} </div>
        <div>{tagFeed.feedCode || <Skeleton />}</div>
        <div>
          <Link href={tagFeed.feedCode == 'FEED_DIARY' ? `diary/${tagFeed.feedId}` : `post/${tagFeed.feedId}`}>
            {tagFeed.imagePath ? <img src={tagFeed.imagePath} width={300} height={300} alt='' /> : <Skeleton width={300} height={300} />}
          </Link>
        </div>
        <div>{tagFeed.content}</div>
      </div>
    </>
  );
}
