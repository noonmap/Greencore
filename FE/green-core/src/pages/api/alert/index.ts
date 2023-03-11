import type { NextApiRequest, NextApiResponse } from 'next';
import { AlertType } from '@/core/alert/alertType';

export type Data = {
  result: string;
  data: Array<AlertType>;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
  } else if (req.method === 'GET') {
    // res.status(400).json({ result: 'FAIL', data: null });
    // console.log(req.query.page);

    const page = Number(req.query.page);

    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          alertId: page * 6 + 1,
          content: '류승태님이 당신을 팔로우 했습니다.',
          urlPath: 'https://github.com/seungtaeryu/',
          createdAt: '2023-03-09T12:00:00',
        },
        {
          alertId: page * 6 + 2,
          content: '최형규님이 당신을 팔로우 했습니다.',
          urlPath: 'https://github.com/Choihyoungkyu/',
          createdAt: '2023-03-09T12:00:00',
        },
        {
          alertId: page * 6 + 3,
          content: '정채원님이 당신을 팔로우 했습니다.',
          urlPath: 'https://github.com/noonmap/',
          createdAt: '2023-03-09T12:00:00',
        },
        {
          alertId: page * 6 + 4,
          content: '염정아님이 당신을 팔로우 했습니다.',
          urlPath: 'https://github.com/yeomss/',
          createdAt: '2023-03-09T12:00:00',
        },
        {
          alertId: page * 6 + 5,
          content: '김송빈님이 당신을 팔로우 했습니다.',
          urlPath: 'https://github.com/dhyunee/',
          createdAt: '2023-03-09T12:00:00',
        },
        {
          alertId: page * 6 + 6,
          content: '서현아님이 당신을 팔로우 했습니다.',
          urlPath: 'https://github.com/hyeonaseome/',
          createdAt: '2023-03-09T12:00:00',
        },
      ],
    });
  } else if (req.method === 'PUT') {
  } else if (req.method === 'DELETE') {
  }
}
