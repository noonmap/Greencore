import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { TagFeedType } from '../core/feed/feedType';
import { useRouter } from 'next/router';
import styles from '@/components/SearchFeedListItem.module.scss';

export default function SearchFeedListItem(props: { tagFeed: TagFeedType }) {
  const tagFeed = props.tagFeed;
  const router = useRouter();

  function goFeedDetail() {
    if (tagFeed.feedCode == 'FEED_DIARY') {
      router.push(`/diary/${tagFeed.feedId}`);
    } else {
      router.push(`/post/${tagFeed.feedId}`);
    }
  }

  return (
    <>
      <div key={tagFeed.feedId} className={`${styles.container} p-5 w-full `} onClick={goFeedDetail}>
        <div className={`flex`}>
          {tagFeed.imagePath ? (
            <div className={`mr-3 flex-none rounded-xl overflow-hidden`} style={{ width: '100px', height: '100px' }}>
              <img className={`w-full h-full`} src={tagFeed.imagePath} width={100} height={100} alt='' />
            </div>
          ) : (
            <></>
          )}

          <div className='grow'>
            <p>{<>{tagFeed.content}...</> || <Skeleton />}</p>
          </div>
        </div>
      </div>
    </>
  );
}
