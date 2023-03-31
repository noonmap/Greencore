import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: {
        user: {
          nickname: '식집사입니다만',
          profileImagePath: 'http://placekitten.com/200/300',
          introduction: '안녕, 나는 싸피야',
          followingCount: 2,
          followerCount: 3,
          isFollowed: false,
        },
        postId: 0,
        content: '하이~',
        imagePath: 'http://placekitten.com/200/300',
        tags: ['#내', '#이름은', '#싸피', '#탐정이죠'],
        createdAt: '2023-03-20',
        likeCount: 2,
        commentCount: 3,
      },
    });
  } else if (req.method === 'PUT') {
    res.status(200).json({
      result: 'SUCCESS',
      data: {},
    });
  } else if (req.method === 'DELETE') {
    res.status(200).json({
      result: 'SUCCESS',
      data: {},
    });
  }
}
