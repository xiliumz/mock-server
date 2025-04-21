import Route from '../types/route';

/**
 * Represents a module exporting one or more Route objects.
 * The keys are export names, and the values are Route definitions.
 */
type RouteModule = {
  [key: string]: Route<any>;
};

/**
 * Represents a mapping from route path and method to its Route definition.
 * The key is a composite of the route path and method (e.g., 'GET:/users'),
 * and the value is the Route object.
 */
type RoutesByPath = {
  [pathAndMethod: string]: Route<any>;
};

/**
 * Creates a unique key for a route based on its HTTP method and path
 */
function createRouteKey(route: Route<any>): string {
  return `${route.method.toUpperCase()}:${route.path}`;
}

/**
 * Transforms an array of route modules into a single object mapping paths to Route definitions.
 *
 * This is useful for aggregating all route exports from multiple modules into a flat
 * object keyed by the route's method and path combination, which can then be used for
 * registration or lookup.
 *
 * @param routes - An array of route modules, each exporting one or more Route objects.
 * @returns An object mapping each route's method and path combination to its Route definition.
 *
 * @example
 * // Given:
 * // const userRoutes = {
 * //   index: { path: '/users', method: 'get', ... },
 * //   create: { path: '/users', method: 'post', ... }
 * // };
 * // transformRoutesToPathBased([userRoutes]);
 * // => { 'GET:/users': {...}, 'POST:/users': {...} }
 */
export function transformRoutesToPathBased(routes: RouteModule[]): RoutesByPath {
  const result: RoutesByPath = {};

  routes.forEach((moduleRoutes) => {
    Object.values(moduleRoutes).forEach((route) => {
      const key = createRouteKey(route);
      result[key] = route;
    });
  });

  return result;
}
