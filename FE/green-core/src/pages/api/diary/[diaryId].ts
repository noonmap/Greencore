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
        diarySetId: 0,
        observationDate: '2023-03-01',
        content: '잘자라요~',
        tags: ['해시태그', '좋아요', '해시태그', '좋아요', '해시태그', '좋아요', '해시태그', '좋아요'],
        imagePath: 'http://placekitten.com/200/300',
        likeCount: 1,
        createdAt: '2023-03-01T07:00:00',
        isLiked: false,
        commentCount: 9,
        user: {
          nickname: '너구리',
          profileImagePath: 'http://placekitten.com/200/300',
          introduction: '너굴너굴',
          followingCount: 4,
          followerCount: 10,
          isFollowed: false,
        },
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
