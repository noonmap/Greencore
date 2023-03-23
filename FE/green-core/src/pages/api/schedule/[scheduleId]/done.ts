import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const scheduleId = Number(req.query.scheduleId);
    console.log(scheduleId);
    res.status(200).json({
      result: 'SUCCESS',
      data: [],
    });
  } else if (req.method === 'PUT') {
    const scheduleId = Number(req.query.scheduleId);
    console.log(scheduleId);
    res.status(200).json({
      result: 'SUCCESS',
      data: [],
    });
  }
}
