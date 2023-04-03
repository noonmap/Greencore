import { NextRouter } from 'next/router';

// 포스트 생성 타입
export type CreatePostType = {
  router: NextRouter;
  payload: {
    content: string;
    image: Object;
    tags: Array<string>;
  };
};

// 포스트 수정 타입
export type UpdatePostType = {
  router: NextRouter;
  postId: number;
  payload: {
    content: string;
    image: Object;
    tags: Array<string>;
  };
};

// 포스트 삭제 타입
export type DeletePostType = {
  router: NextRouter;
  postId: number;
};

// 포스트 조회
export type GetPostListType = {
  nickname: string;
  page: number;
  size: number;
};
