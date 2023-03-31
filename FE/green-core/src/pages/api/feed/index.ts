import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedType } from '@/core/feed/feedType';

export type Data = {
  result: string;
  data: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const page = Number(req.query.page);

    if (page >= 10) {
      res.status(200).json({
        result: 'SUCCESS',
        data: [],
      });
    } else {
      res.status(200).json({
        result: 'SUCCESS',
        data: {
          content: [
            {
              user: {
                nickname: '닉네임',
                profileImagePath: '/images/noProfile.png',
                introduction: '한 줄 자기소개',
                followingCount: 1,
                followerCount: 1,
                isFollowed: true,
              },
              feedCode: 'FEED_DIARY',
              opservationDate: '2023-03-13', // 일지에만
              feedId: page * 2 + 1,
              content: '치코치코',
              imagePath: 'http://www.urbanbrush.net/web/wp-content/uploads/edd/2018/08/urbanbrush-20180822082426113204.png', // 포스트엔 없을수도
              likeCount: 1,
              isLiked: true,
              createdAt: '2023-03-27T17:05:00',
              commentCount: 1,
              diarySetTitle: '관찰일지 Title',
              growingDay: 100,
            },
            {
              user: {
                nickname: '닉네임',
                profileImagePath: '/images/noProfile.png',
                introduction: '한 줄 자기소개',
                followingCount: 1,
                followerCount: 1,
                isFollowed: true,
              },
              feedCode: 'FEED_POST',
              opservationDate: '2023-03-13', // 일지에만
              feedId: page * 2 + 2,
              content: '치코치코',
              imagePath: 'http://www.urbanbrush.net/web/wp-content/uploads/edd/2018/08/urbanbrush-20180822082426113204.png', // 포스트엔 없을수도
              likeCount: 1,
              isLiked: false,
              createdAt: '2023-03-13T13:00:00',
              commentCount: 1,
              diarySetTitle: '관찰일지 Title',
              growingDay: 100,
            },
          ],
        },
      });
    }
  }
}
