import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    // console.log(req.query.nickname);
    res.status(400).json({ result: 'SUCCESS', data: true });
  } else {
    res.status(400).json({ result: 'FAIL', data: true });
  }
}
