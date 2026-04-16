export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
