export type SearchType = {
  search: string;
  page: number;
  size: number;
};

export type PlainResData = {
  result: string;
  data: Object | boolean | null | Array<Object>;
};
