import HTTPMethod from './http-method';
import { QueryParam } from './query-param';
import { Request } from 'hyper-express';

export default interface Route<T> {
  path: string;

  method: HTTPMethod;

  response: T | ((req: Request) => T | Promise<T>);

  queryParams?: QueryParam<T>[];
}
