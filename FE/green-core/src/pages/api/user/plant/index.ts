import type { NextApiRequest, NextApiResponse } from 'next';
import { PlainResData } from '@/core/common/commonType';

export default function handler(req: NextApiRequest, res: NextApiResponse<PlainResData>) {
	if (req.method === 'POST') {
		// 키우는 식물 생성
		res.status(200).json({ result: 'SUCCESS', data: false });
	} else {
		res.status(400).json({ result: 'FAIL', data: false });
	}
}
