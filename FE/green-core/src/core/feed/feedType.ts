export type FeedDataType = {
  page: number;
  size: number;
};

export type FeedType = {
  user: {
    nickname: string;
    profileImagePath: string;
    introduction: string;
    followingCount: number;
    followerCount: number;
    isFollowed: boolean;
  };
  feedCode: string;
  opservationDate?: string; // 일지에만
  feedId: number;
  content: string;
  imagePath?: string; // 포스트엔 없을수도
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  commentCount: number;
  diarySetTitle: string;
  growingDay: number;
};

export type TagFeedType = {
  feedId: number;
  feedCode: string;
  imagePath?: string;
  content: string;
};

// 댓글 리스트 조회 타입
export type getCommentListType = {
  feedId: number;
  page: number;
  size: number;
};

// 댓글 생성 타입
export type createCommentType = {
  feedId: number;
  payload: {
    content: string;
    mentionNickname: Array<string>;
  };
};

// 댓글 수정 타입
export type updateCommentType = {
  feedId: number;
  commentId: number;
  payload: {
    content: string;
    mentionNickname: Array<string>;
  };
};

// 댓글 삭제 타입
export type deleteCommentType = {
  feedId: number;
  commentId: number;
};
