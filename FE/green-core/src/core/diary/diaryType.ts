export type DiaryType = {
  // albumId: number;
  // id: number;
  // title: string;
  // url: string;
  // thumbnailUrl: string;

  diaryId: number;
  content: string;
  tags: Array<string>;
  opservationDate: string;
  createdAt: string;
  imagePath: FormData;
  commentCount: number;
};

export type CreateDiaryType = {
  diarySetId: number;
  content: string;
  tags: Array<string>;
  opservationDate: string;
  image: FormData;
};
