
export interface BaseApiResponse<T> {
  data: T;

  timeTakenMs: string;
}

export class PaginationResult<T> implements BaseApiResponse<T[]> {
  data: T[];
  total: number;
  pageSize: number;

  timeTakenMs: string;

  constructor([data, total]: [T[], number], pageSize: number)
  {
    this.data = data;
    this.total = total;
    this.pageSize = pageSize;
  }
}
