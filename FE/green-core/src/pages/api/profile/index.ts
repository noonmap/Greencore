import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    const page = Number(req.query.page);

    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          nickname: `닉네임 ${page * 2 + 1}`,
          profileImagePath: 'images/noProfile.png',
        },

        {
          nickname: `닉네임 ${page * 2 + 2}`,
          profileImagePath: 'images/noProfile.png',
        },
      ],
    });
  } else if (req.method === 'PUT') {
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
