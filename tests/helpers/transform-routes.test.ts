import { transformRoutesToPathBased } from '../../src/helpers/transform-routes';
import Route from '../../src/types/route';

describe('transformRoutesToPathBased', () => {
  it('should transform an array of route modules into a path-based object', () => {
    // Mock route modules
    const userRoutes = {
      index: {
        path: '/users',
        method: 'get',
        response: { data: [] },
      } as Route<any>,
      show: {
        path: '/users/:id',
        method: 'get',
        response: { data: {} },
      } as Route<any>,
    };

    const postRoutes = {
      index: {
        path: '/posts',
        method: 'get',
        response: { data: [] },
      } as Route<any>,
    };

    const result = transformRoutesToPathBased([userRoutes, postRoutes]);

    // Verify the transformation
    expect(result).toEqual({
      '/users': userRoutes.index,
      '/users/:id': userRoutes.show,
      '/posts': postRoutes.index,
    });
  });

  it('should handle empty route modules array', () => {
    const result = transformRoutesToPathBased([]);
    expect(result).toEqual({});
  });

  it('should handle route modules with no routes', () => {
    const result = transformRoutesToPathBased([{}, {}]);
    expect(result).toEqual({});
  });

  it('should handle route modules with overlapping paths', () => {
    const module1 = {
      route1: {
        path: '/test',
        method: 'get',
        response: { data: 'first' },
      } as Route<any>,
    };

    const module2 = {
      route2: {
        path: '/test',
        method: 'post',
        response: { data: 'second' },
      } as Route<any>,
    };

    const result = transformRoutesToPathBased([module1, module2]);

    // The last route module's definition should win
    expect(result).toEqual({
      '/test': module2.route2,
    });
  });
});
