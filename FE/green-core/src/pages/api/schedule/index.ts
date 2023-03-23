import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    console.log(month, year);
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          scheduleId: 0,
          scheduleDate: '2023-03-22T13:00',
          scheduleCode: 'WATER',
          isCompleted: true,
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
          content: '선인장 물 줬음',
        },
        {
          scheduleId: 3,
          scheduleDate: '2023-03-24T18:00',
          scheduleCode: 'REPOT',
          isCompleted: false,
          plant: {
            plantId: 1,
            userPlantId: 1,
            plantNickname: '소나무',
          },
          content: '소나무 물 줬음',
        },
        {
          scheduleId: 1,
          scheduleDate: '2023-03-23T13:00',
          scheduleCode: 'WATER',
          isCompleted: false,
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
          content: '선인장 물 줬음',
        },
        {
          scheduleId: 2,
          scheduleDate: '2023-03-22T13:00',
          scheduleCode: 'WATER',
          isCompleted: false,
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
          content: '선인장 물 줬음',
        },
        {
          scheduleId: 4,
          scheduleDate: '2023-03-24T13:00',
          scheduleCode: 'PRUNING',
          isCompleted: false,
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
          content: '선인장 가지쳤음',
        },
        {
          scheduleId: 5,
          scheduleDate: '2023-03-24T13:00',
          scheduleCode: 'NUTRITION',
          isCompleted: false,
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
          content: '선인장 영양제 줬음',
        },
        {
          scheduleId: 6,
          scheduleDate: '2023-03-24T13:00',
          scheduleCode: 'VENTILATION',
          isCompleted: false,
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
          content: '선인장 환기 시켜줌',
        },
        {
          scheduleId: 7,
          scheduleDate: '2023-03-24T13:00',
          scheduleCode: 'SPRAY',
          isCompleted: false,
          plant: {
            plantId: 0,
            userPlantId: 0,
            plantNickname: '선인장',
          },
          content: '선인장 미스트 뿌려줌',
        },
      ],
    });
  }
}
