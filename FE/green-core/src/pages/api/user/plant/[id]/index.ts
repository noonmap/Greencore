import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

type Data = {};

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    // 키우는 식물 리스트 조회
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          userPlantId: 1,
          plantId: 1,
          plantNickname: 'myPlant1',
          plantName: '대파',
          plantImagePath: '/public/images/plant.png',
        },
        {
          userPlantId: 2,
          plantId: 2,
          plantNickname: 'myPlant2',
          plantName: '토마토',
          plantImagePath: '/public/images/plant.png',
        },
      ],
    });
  } else if (req.method === 'PUT') {
    // 키우는 식물 닉네임 수정
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else if (req.method === 'DELETE') {
    // 키우는 식물 삭제
    res.status(200).json({ result: 'SUCCESS', data: true });
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
