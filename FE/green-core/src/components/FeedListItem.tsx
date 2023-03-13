import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { FeedType } from '../core/feed/feedType';
import Image from 'next/image';
import styles from '@/styles/feed.module.scss';

export default function FeedListItem(props: { feed: FeedType }) {
  const feed = props.feed;

  return (
    <>
      <div key={feed.feedId} className={`${styles.feedContainer} bg-green-300`}>
        <div className={`${styles.helpTip} flex `}>
          <div id='userInfo'>
            {feed.user.profileImagePath ? (
              <Image className='mb-3' src={feed.user.profileImagePath} alt='로고' width='30' height='30'></Image>
            ) : (
              <Skeleton width={30} height={30} />
            )}
            <span>{feed.user.nickname || <Skeleton />}</span>
            <br />
            <span>{feed.user.introduction || <Skeleton />}</span>
            <br />
            <span>팔로워 수 : {feed.user.followerCount || <Skeleton />}</span>
            <br />
            <span>팔로잉 수 : {feed.user.followingCount || <Skeleton />}</span>
            <br />
            <span>팔로잉 여부 : {feed.user.isFollowed ? 'true' : 'false'}</span>
          </div>
          <Image className='mb-3' src={feed.user.profileImagePath} alt='로고' width='30' height='30'></Image>
          <span>{feed.user.nickname || <Skeleton />}</span>
        </div>
        <div>feedCode : {feed.feedCode || <Skeleton />}</div>
        <div>관찰일자? : {feed.opservationDate || <Skeleton />}</div>
        <div>feedId : {feed.feedId || <Skeleton />}</div>
        <div>내용 : {feed.content || <Skeleton />}</div>
        <div>
          <Link href={feed.feedCode == 'FEED_DIARY' ? `diary/${feed.feedId}` : `post/${feed.feedId}`}>
            {feed.imagePath ? (
              <img
                className='inline-block'
                src='https://blog.kakaocdn.net/dn/lpYCZ/btrzwex57Ty/08c2P9aZ1iSUawi5wag1Pk/img.png'
                alt='로고'
                width='300'
                height='300'></img>
            ) : (
              <Skeleton width={300} height={300} />
            )}
          </Link>
        </div>
        <div>좋아요 수 : {feed.likeCount || <Skeleton />}</div>
        <div>좋아요 여부 : {feed.isLiked ? 'true' : 'false' || <Skeleton />}</div>
        <div>댓글 수 : {feed.commentCount || <Skeleton />}</div>
        <div>작성일자 : {feed.craetedAt || <Skeleton />}</div>
      </div>
    </>
  );
}
