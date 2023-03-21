import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const page = Number(req.query.page);

    if (page >= 3) {
      res.status(200).json({
        result: 'SUCCESS',
        data: [],
      });
    } else {
      res.status(200).json({
        result: 'SUCCESS',
        data: [
          {
            commentId: 3 * page,
            user: {
              nickname: ' 문동은',
              profileImagePath: 'http://placekitten.com/200/300',
              introduction: '내 꿈은 박연진',
              followingCount: 200,
              followerCount: 10,
              isFollowed: false,
            },
            content: `${3 * page}번째 댓글 @문동은 @주여정`,
            mentionNickname: '',
            createdAt: '2023-03-01T07:00:00',
          },
          {
            commentId: 3 * page + 1,
            user: {
              nickname: ' 주여정',
              profileImagePath: 'http://placekitten.com/200/300',
              introduction: '1%의 사나이',
              followingCount: 200,
              followerCount: 110,
              isFollowed: false,
            },
            content: `${3 * page + 1}번째 댓글`,
            mentionNickname: '',
            createdAt: '2023-03-01T07:00:00',
          },
          {
            commentId: 3 * page + 2,
            user: {
              nickname: '박연진',
              profileImagePath: 'http://placekitten.com/200/300',
              introduction: '예솔이 엄마',
              followingCount: 10,
              followerCount: 10,
              isFollowed: false,
            },
            content: `${3 * page + 2}번째 댓글`,
            mentionNickname: '',
            createdAt: '2023-03-01T07:00:00',
          },
        ],
      });
    }
  } else if (req.method === 'POST') {
    res.status(200).json({
      result: 'SUCCESS',
      data: {},
    });
  }
}
