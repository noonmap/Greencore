import { NextRouter } from 'next/router';

// 일지 타입
export type DiaryType = {
  diaryId: number;
  content: string;
  tags: Array<string>;
  opservationDate: string;
  createdAt: string;
  imagePath: FormData;
  commentCount: number;
};

// 일지 생성 타입
export type CreateDiaryType = {
  router: NextRouter;
  payload: {
    diarysetId: number;
    content: string;
    opservationDate: string;
    image: Object;
    tags: Array<string>;
  };
};

// 일지 삭제
export type DeleteDiaryType = {
  router: NextRouter;
  payload: {
    diaryId: number;
  };
};

// 일지 수정
export type UpdateDiaryType = {
  router: NextRouter;
  payload: {
    diarysetId: number;
    diaryId: number;
    content: string;
    opservationDate: string;
    image: Object;
    tags: Array<string>;
  };
};
