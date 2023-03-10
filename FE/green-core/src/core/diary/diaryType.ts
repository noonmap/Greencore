export type DiaryType = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;

  // diarySetId: number;
  // content: string;
  // tags: Array<string>;
  // opservationDate: string;
  // image: FormData;
};

export type CreateDiaryType = {
  diarySetId: number;
  content: string;
  tags: Array<string>;
  opservationDate: string;
  image: FormData;
};
