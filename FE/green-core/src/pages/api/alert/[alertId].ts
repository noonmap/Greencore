import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  result: string;
  data: object | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
  } else if (req.method === "GET") {
  } else if (req.method === "PUT") {
  } else if (req.method === "DELETE") {
    // 성공 예제
    // res.status(200).json({
    //   result: "SUCCESS",
    //   data: null,
    // });

    // 실패 예제
    res.status(400).json({ result: "FAIL", data: null });
  }
}
