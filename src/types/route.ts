import HTTPMethod from './http-method';
import { QueryParam } from './query-param';

export default interface Route<T> {
  path: string;

  method: HTTPMethod;

  response: T;

  queryParams?: QueryParam<T>[];
}
