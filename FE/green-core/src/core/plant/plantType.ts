export type SearchType = {
  search: string;
  page?: number;
  size?: number;
};

export type IndexType = {
  index: string;
  page?: number;
  size?: number;
};

export type SearchPlantType = {
  plantId: number;
  imagePath: string;
  plantName: string;
};
