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
  craetedAt: string;
  commentCount: number;
};
