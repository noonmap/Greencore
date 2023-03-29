import type { NextApiRequest, NextApiResponse } from 'next';
import { TagFeedType } from '@/core/feed/feedType';

export type Data = {
  result: string;
  data: Array<TagFeedType>;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const page = Number(req.query.page);

    if (page >= 30) {
      res.status(200).json({
        result: 'SUCCESS',
        data: [],
      });
    } else {
      res.status(200).json({
        result: 'SUCCESS',
        data: [
          {
            feedId: page * 2 + 1,
            feedCode: 'FEED_DIARY',
            imagePath: 'https://www.urbanbrush.net/web/wp-content/uploads/edd/2018/08/urbanbrush-20180822082426113204.png',
            content: '물줘 물!!',
          },
          {
            feedId: page * 2 + 2,
            feedCode: 'FEED_POST',
            // imagePath: 'https://i1.sndcdn.com/avatars-mHalH2yXGeayCWfR-fsdm0w-t240x240.jpg',
            content: '치코 치코 !',
          },
        ],
      });
    }
  }
}
