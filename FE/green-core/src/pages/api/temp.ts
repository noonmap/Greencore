import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
  } else if (req.method === 'GET') {
    res.status(200).json({ name: 'John Doe' });
  } else if (req.method === 'PUT') {
  } else if (req.method === 'DELETE') {
  }
}
