export type DiarySetType = {
  userPlantId: number | string;
  image: FormData;
  startDate: string;
  title: string;
};

export type SearchDiarySetType = {
  diarySetId: number;
  startDate: string;
  imagePath: string;
  title: string;
};
