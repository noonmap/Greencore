import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          plantId: 1,
          plantName: '토마토',
          imagePath: '/img/default.jpg',
        },
        {
          plantId: 2,
          plantName: '토마토',
          imagePath: '/img/default.jpg',
        },
        {
          plantId: 3,
          plantName: '토마토',
          imagePath: '/img/default.jpg',
        },
      ],
    });
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
