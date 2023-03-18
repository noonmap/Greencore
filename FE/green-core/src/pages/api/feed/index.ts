import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedType } from '@/core/feed/feedType';

export type Data = {
  result: string;
  data: Array<FeedType>;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    // res.status(400).json({ result: 'FAIL', data: null });
    // console.log(req.query.page);
    // console.log(req.query.size);
    console.log('44444444444444444');
    const page = Number(req.query.page);

    if (page >= 10) {
      res.status(200).json({
        result: 'SUCCESS',
        data: [],
      });
    } else {
      res.status(200).json({
        result: 'SUCCESS',
        data: [
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
            imagePath: 'https://blog.kakaocdn.net/dn/lpYCZ/btrzwex57Ty/08c2P9aZ1iSUawi5wag1Pk/img.png', // 포스트엔 없을수도
            likeCount: 1,
            isLiked: true,
            craetedAt: '2023-03-13T13:00:00',
            commentCount: 1,
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
            imagePath: 'https://blog.kakaocdn.net/dn/lpYCZ/btrzwex57Ty/08c2P9aZ1iSUawi5wag1Pk/img.png', // 포스트엔 없을수도
            likeCount: 1,
            isLiked: false,
            craetedAt: '2023-03-13T13:00:00',
            commentCount: 1,
          },
        ],
      });
    }
  }
}
