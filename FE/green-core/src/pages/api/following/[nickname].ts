import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'POST') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else if (req.method === 'DELETE') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else if (req.method === 'GET') {
    const page = Number(req.query.page);

    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          nickname: `following ${page * 10 + 1}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 2}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 3}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 4}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 5}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 6}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 7}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 8}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 9}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        {
          nickname: `following ${page * 10 + 10}`,
          profileImagePath: '/public/images/profile.png',
          introduction: '안녕하세요 test11 입니다',
          isFollowed: true, // 내가 팔로우한 여부
        },
        // {
        //   nickname: 'test22',
        //   profileImagePath: '/public/images/profile.png',
        //   introduction: '안녕하세요 test22 입니다',
        //   isFollowed: true, // 내가 팔로우한 여부
        // },
        // {
        //   nickname: '식집사입니다만',
        //   profileImagePath: '/public/images/profile.png',
        //   introduction: '안녕하세요 test33 입니다',
        //   isFollowed: true, // 내가 팔로우한 여부
        // },
      ],
    });
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
