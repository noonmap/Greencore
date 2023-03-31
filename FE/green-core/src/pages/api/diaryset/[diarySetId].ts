import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    res.status(200).json({ result: 'SUCCESS', data: { diaryId: 0 } });
  }
}
