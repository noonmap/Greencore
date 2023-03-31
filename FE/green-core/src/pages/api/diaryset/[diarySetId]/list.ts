import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  result: string;
  data: Object | string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    console.log('3');
    res.status(200).json({
      result: 'SUCCESS',
      data: {
        content: [
          {
            bookmarkCount: 2,
            diaryCount: 4,
            diarySetId: 0,
            imagePath: 'http://placekitten.com/200/300',
            isBookmarked: true,
            title: '금쪽같은 내 새끼',
          },
          {
            bookmarkCount: 10,
            diaryCount: 10,
            diarySetId: 1,
            imagePath: 'http://placekitten.com/200/300',
            isBookmarked: true,
            title: '식물아 자라라',
          },
          {
            bookmarkCount: 100,
            diaryCount: 100,
            diarySetId: 2,
            imagePath: 'http://placekitten.com/200/300',
            isBookmarked: true,
            title: '산소 만드는중',
          },
        ],
        empty: true,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        pageable: {
          offset: 0,
          pageNumber: 0,
          pageSize: 0,
          paged: true,
          sort: {
            empty: true,
            sorted: true,
            unsorted: true,
          },
          unpaged: true,
        },
        size: 0,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        totalElements: 0,
        totalPages: 0,
      },
    });
  }
}
