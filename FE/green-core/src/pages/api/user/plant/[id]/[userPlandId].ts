import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

type Data = {};

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
	if (req.method === 'GET') {
		res.status(200).json({
			result: 'SUCCESS',
			data: {
				userPlantId: 1,
				plantId: 1,
				plantNickname: 'myPlant',
				plantName: '대파',
				plantImagePath: '/public/images/plant.png'
			}
		});
	} else {
		res.status(400).json({ result: 'FAIL', data: false });
	}
}
