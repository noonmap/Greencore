import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedType } from '@/core/feed/feedType';

export type Data = {
  result: string;
  data: boolean;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    res.status(200).json({
      result: 'SUCCESS',
      data: true,
    });
  } else if (req.method === 'DELETE') {
    res.status(200).json({
      result: 'SUCCESS',
      data: true,
    });
  }
}
