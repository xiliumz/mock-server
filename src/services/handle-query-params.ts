import { Request } from 'hyper-express';
import getQueryParamsValue from '../helpers/get-query-params-value';
import { QueryParams } from '../types/query-params';

/**
 * Processes query parameters for a request and applies their handlers to the result
 * @template T - The type of the response data
 * @param req - The incoming request object
 * @param result - The result object to be modified by query parameters
 * @param queryParams - Array of query parameter configurations
 */
export default function handleQueryParams<T extends Record<string, unknown>>(
  req: Request,
  result: T,
  queryParams?: QueryParams<T>[]
): void {
  if (!queryParams?.length) return;

  for (const param of queryParams) {
    const value = getQueryParamsValue(req, param.name);
    if (value) {
      param.handler(result, value);
    }
  }
} 
