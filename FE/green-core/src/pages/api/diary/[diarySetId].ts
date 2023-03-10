import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    res.status(200).json({ result: 'SUCCESS', data: null });
  } else if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: {
        user: {
          nickname: '목마름',
          profileImagePath: 'image',
        },
        title: '사막의 수호신',
        startDate: '2023-03-01',
        diaryList: [
          {
            diaryId: 0,
            content: '잘자라요~',
            tags: [],
            opservationDate: '2023-03-01',
            createdAt: '2023-03-01T07:00:00',
            imagePath: 'cactus',
            commentCount: 0,
          },
        ],
      },
    });
  }
}
