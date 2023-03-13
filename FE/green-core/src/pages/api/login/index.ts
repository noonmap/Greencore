import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'POST') {
    res.setHeader('authorization', 'Bearer accessToken!!');
    res.setHeader('X-Refresh-Token', 'refreshToken!!');
    res.status(200).json({ result: 'SUCCESS', data: null });
  } else {
    res.status(400).json({ result: 'FAIL', data: null });
  }
}
