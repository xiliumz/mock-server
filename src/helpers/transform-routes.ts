import Route from '../types/route';

/**
 * Represents a module exporting one or more Route objects.
 * The keys are export names, and the values are Route definitions.
 */
type RouteModule = {
  [key: string]: Route<any>;
};

/**
 * Represents a mapping from route path to its Route definition.
 * The key is the route path (e.g., '/users'), and the value is the Route object.
 */
type RoutesByPath = {
  [path: string]: Route<any>;
};

/**
 * Transforms an array of route modules into a single object mapping paths to Route definitions.
 *
 * This is useful for aggregating all route exports from multiple modules into a flat
 * object keyed by the route's path, which can then be used for registration or lookup.
 *
 * @param routes - An array of route modules, each exporting one or more Route objects.
 * @returns An object mapping each route's path to its Route definition.
 *
 * @example
 * // Given:
 * // const userRoutes = { index: { path: '/users', ... }, show: { path: '/users/:id', ... } };
 * // const postRoutes = { index: { path: '/posts', ... } };
 * // transformRoutesToPathBased([userRoutes, postRoutes]);
 * // => { '/users': {...}, '/users/:id': {...}, '/posts': {...} }
 */
export function transformRoutesToPathBased(routes: RouteModule[]): RoutesByPath {
  const result: RoutesByPath = {};

  routes.forEach((moduleRoutes) => {
    Object.values(moduleRoutes).forEach((route) => {
      result[route.path] = route;
    });
  });

  return result;
}
