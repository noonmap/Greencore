import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          regularScheduleId: 0,
          regularScheduleCode: '0',
          day: 29,
          scheduleCode: 'WATER',
          content: '선인장 물주기',
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
        },
        {
          regularScheduleId: 1,
          regularScheduleCode: '1',
          day: 1,
          scheduleCode: 'REPOT',
          content: '선인장 분갈이',
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
        },
        {
          regularScheduleId: 2,
          regularScheduleCode: '1',
          day: 2,
          scheduleCode: 'VENTILATION',
          content: '선인장 환기',
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
        },
      ],
    });
  }
}
