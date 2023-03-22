import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          nickname: 'rst',
          profileImagePath: '/images/noProfile.png',
          // introduction: '안녕하세요 test 입니다',
          // followingCount: 111,
          // followerCount: 222,
        },
        {
          nickname: 'jcw',
          profileImagePath: '/images/noProfile.png',
          // introduction: '안녕하세요 test 입니다',
          // followingCount: 111,
          // followerCount: 222,
        },
        {
          nickname: 'chk',
          profileImagePath: '/images/noProfile.png',
          // introduction: '안녕하세요 test 입니다',
          // followingCount: 111,
          // followerCount: 222,
        },
      ],
    });
  } else {
    res.status(400).json({ result: 'FAIL', data: null });
  }
}
