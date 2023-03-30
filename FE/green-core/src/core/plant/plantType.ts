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
  id: number;
  name: string;
  specificName: string;
  water: string;
  light: string;
  humidity: string;
  temperature: string;
  imagePath: string;
};
