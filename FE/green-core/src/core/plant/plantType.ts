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

export type PlantType = {
  plantId: number;
  imagePath: string;
  plantName: string;
};

export type SearchPlantDetailType = {
  plantId: number;
  imagePath: string;
  plantName: string;
};
