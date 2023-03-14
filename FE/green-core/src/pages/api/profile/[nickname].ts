import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: {
        nickname: 'test',
        profileImagePath: '/public/images/profile.png',
        introduction: '안녕하세요 test 입니다',
        followingCount: 111,
        followerCount: 222,
        isFollowed: false,
      },
    });
  } else if (req.method === 'POST') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  }
}
