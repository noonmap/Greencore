import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    const page = Number(req.query.page);
    const size = Number(req.query.size);
    const search = String(req.query.search);
    const index = String(req.query.index);

    if (page % 2 === 0) {
      res.status(200).json({
        result: 'SUCCESS',
        data: {
          totalElements: 50,
          content: [
            {
              plantId: 1,
              plantName: '파',
            },
            {
              plantId: 2,
              plantName: '쪽파',
            },
            {
              plantId: 3,
              plantName: '대파',
            },
            {
              plantId: 4,
              plantName: '양파',
            },
            {
              plantId: 5,
              plantName: '어쩌구',
            },
          ],
        },
      });
    } else {
      res.status(200).json({
        result: 'SUCCESS',
        data: {
          totalElements: 50,
          content: [
            {
              plantId: 6,
              plantName: '팽이버섯',
            },
            {
              plantId: 7,
              plantName: '양송이버섯',
            },
            {
              plantId: 8,
              plantName: '새송이버섯',
            },
            {
              plantId: 9,
              plantName: '느타리버섯',
            },
            {
              plantId: 10,
              plantName: '어쩌구',
            },
          ],
        },
      });
    }
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
