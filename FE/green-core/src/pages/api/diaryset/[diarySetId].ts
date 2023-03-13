import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    res.status(200).json({ result: 'SUCCESS', data: null });
  } else if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: {
        user: {
          nickname: '목마름',
          profileImagePath: 'http://placekitten.com/200/300',
        },
        title: '사막의 수호신',
        startDate: '2023-03-01',
        diaryList: [
          {
            diaryId: 0,
            content: '잘자라요~',
            tags: ['해시태그', '좋아요'],
            opservationDate: '2023-03-01',
            createdAt: '2023-03-01T07:00:00',
            imagePath: 'http://placekitten.com/200/300',
            commentCount: 0,
          },
          {
            diaryId: 1,
            content: `${1}번째 관찰일지\n날씨 좋다~`,
            tags: ['하이', '광합성', '1', '2'],
            opservationDate: '2023-03-04',
            createdAt: '2023-03-03T11:00:11', // diary 생성 시간
            imagePath: 'http://placekitten.com/200/300',
            commentCount: 10,
          },
          {
            diaryId: 2,
            content: `${2}번째 관찰일지\n날씨 좋다~`,
            tags: ['ㅋㅋㅋㅋ', '테스트 하는 중'],
            opservationDate: '2023-03-04',
            createdAt: '2023-03-03T11:00:11', // diary 생성 시간
            imagePath: 'http://placekitten.com/200/300',
            commentCount: 10,
          },
          {
            diaryId: 3,
            content: `${3}번째 관찰일지\n날씨 좋다~`,
            tags: ['테스트', '테스트2'],
            opservationDate: '2023-03-04',
            createdAt: '2023-03-03T11:00:11', // diary 생성 시간
            imagePath: 'http://placekitten.com/200/300',
            commentCount: 10,
          },
          {
            diaryId: 4,
            content: `${4}번째 관찰일지\n날씨 좋다~`,
            tags: ['커피', '마시고 싶다'],
            opservationDate: '2023-03-04',
            createdAt: '2023-03-03T11:00:11', // diary 생성 시간
            imagePath: 'http://placekitten.com/200/300',
            commentCount: 10,
          },
          {
            diaryId: 5,
            content: `${5}번째 관찰일지\n날씨 좋다~`,
            tags: ['식물', '키우자'],
            opservationDate: '2023-03-04',
            createdAt: '2023-03-03T11:00:11', // diary 생성 시간
            imagePath: 'http://placekitten.com/200/300',
            commentCount: 10,
          },
          {
            diaryId: 6,
            content: `${6}번째 관찰일지\n날씨 좋다~`,
            tags: ['식집사', '화이팅'],
            opservationDate: '2023-03-04',
            createdAt: '2023-03-03T11:00:11', // diary 생성 시간
            imagePath: 'http://placekitten.com/200/300',
            commentCount: 10,
          },
        ],
      },
    });
  }
}
