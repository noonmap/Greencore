import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';
import fs from 'fs';
import path from 'path';

export type Data = {
  result: string;
  data: Object | boolean | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    var folder = 'C:\\SSAFY\\Green-Core\\FE\\green-core\\public\\images\\noProfile.png';
    // const filepath = path.join(__dirname, './noProfile.png');
    const image = fs.createReadStream(folder);
    console.log(image);
    res.status(200).json({ result: 'SUCCESS', data: image });
  }
}
