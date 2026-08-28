export type Category = {
  id: string;
  name: string;
};
export type GetCategoriesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
};
