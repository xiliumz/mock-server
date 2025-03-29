import HTTPMethod from './http-method';
import { QueryParams } from './query-params';

export default interface Route<T> {
  path: string;

  method: HTTPMethod;

  response: T;

  queryParams?: QueryParams<T>[];
}
