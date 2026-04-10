export interface ApiSuccess<T> {
  data: T;
}

export const success = <T>(data: T): ApiSuccess<T> => ({ data });
