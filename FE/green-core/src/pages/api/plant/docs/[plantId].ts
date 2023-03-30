import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
  if (req.method === 'GET') {
    res.status(200).json({
      result: 'SUCCESS',
      data: [
        {
          id: 1,
          name: '삼색 달개비',
          specificName: "Tradescantia albiflora 'Nanouk'",
          water: '평균 주 1~2회 흙 표면부터 3cm까지 마르면, 듬뿍 주세요',
          light: '반양지 하루 2~3시간 정도의 은은한 햇빛이 필요해요',
          humidity: '40~70% 주변 공기가 너무 축축하지 않게 관리해주세요',
          temperature: '잘 자라는 온도 15~25℃의 온도에서 잘 자라요',
          imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQibOttes-EN0PTc4GfRPXVjJg336bWMTqerw&usqp=CAU',
        },
        // {
        //   id: 2,
        //   name: '식물이름2',
        //   specificName: "Tradescantia albiflora 'Nanouk'",
        //   water: '평균 주 1~2회 흙 표면부터 3cm까지 마르면, 듬뿍 주세요',
        //   light: '반양지 하루 2~3시간 정도의 은은한 햇빛이 필요해요',
        //   humidity: '40~70% 주변 공기가 너무 축축하지 않게 관리해주세요',
        //   temperature: '잘 자라는 온도 15~25℃의 온도에서 잘 자라요',
        //   imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQibOttes-EN0PTc4GfRPXVjJg336bWMTqerw&usqp=CAU',
        // },
      ],
    });
  } else {
    res.status(400).json({ result: 'FAIL', data: false });
  }
}
