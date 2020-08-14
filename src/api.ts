
export interface BaseApiResponse<T> {
  data: T;

  timeTakenMs: string;
}

export class PaginationResult<T> implements BaseApiResponse<T[]> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;

  timeTakenMs: string;

  constructor([data, total]: [T[], number], pageSize: number, page = 0)
  {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
  }
}
