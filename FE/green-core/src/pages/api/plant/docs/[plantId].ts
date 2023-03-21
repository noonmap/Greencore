import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQibOttes-EN0PTc4GfRPXVjJg336bWMTqerw&usqp=CAU',
          plantName: '식물이름',
        },
        {
          imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQibOttes-EN0PTc4GfRPXVjJg336bWMTqerw&usqp=CAU',
          plantName: '식물이름2',
        },
      ],
    });
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
