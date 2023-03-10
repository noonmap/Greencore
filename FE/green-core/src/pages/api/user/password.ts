import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'POST') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else if (req.method === 'PUT') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else {
    res.status(400).json({ result: 'FAIL', data: true });
  }
}
