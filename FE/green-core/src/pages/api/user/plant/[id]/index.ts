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
        {
          userPlantId: 3,
          plantId: 3,
          plantNickname: 'myPlant3',
          plantName: '대파',
          plantImagePath: '/public/images/plant.png',
        },
        {
          userPlantId: 4,
          plantId: 4,
          plantNickname: 'myPlant4',
          plantName: '토마토',
          plantImagePath: '/public/images/plant.png',
        },
        {
          userPlantId: 5,
          plantId: 5,
          plantNickname: 'myPlant5',
          plantName: '대파',
          plantImagePath: '/public/images/plant.png',
        },
        {
          userPlantId: 6,
          plantId: 6,
          plantNickname: 'myPlant6',
          plantName: '토마토',
          plantImagePath: '/public/images/plant.png',
        },
        {
          userPlantId: 7,
          plantId: 7,
          plantNickname: 'myPlant7',
          plantName: '대파',
          plantImagePath: '/public/images/plant.png',
        },
        {
          userPlantId: 8,
          plantId: 8,
          plantNickname: 'myPlant8',
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
