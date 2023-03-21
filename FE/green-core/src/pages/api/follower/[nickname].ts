import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'POST') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else if (req.method === 'DELETE') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          nickname: 'temp',
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test1 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: 'test22',
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test2 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: '식집사입니다만',
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test3 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
      ],
    });
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
