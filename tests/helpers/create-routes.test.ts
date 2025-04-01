import createRoute from '../../src/helpers/create-routes';
import Route from '../../src/types/route';
import { QueryParam } from '../../src/types/query-param';

describe('createRoute', () => {
  it('should return the route object as is', () => {
    const routeObject: Route<Record<string, unknown>> = {
      path: '/test',
      method: 'get',
      response: { data: 'test' },
    };

    const result = createRoute(routeObject);

    expect(result).toBe(routeObject);
    expect(result).toEqual({
      path: '/test',
      method: 'get',
      response: { data: 'test' },
    });
  });

  it('should handle route with query parameters', () => {
    const filterParam: QueryParam<Record<string, unknown>> = {
      name: 'filter',
      handler: jest.fn(),
    };

    const routeObject: Route<Record<string, unknown>> = {
      path: '/test',
      method: 'get',
      response: { data: 'test' },
      queryParams: [filterParam],
    };

    const result = createRoute(routeObject);

    expect(result).toBe(routeObject);
    expect(result.queryParams).toEqual([filterParam]);
  });
});
