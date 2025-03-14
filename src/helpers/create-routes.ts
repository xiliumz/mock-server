import Route from '../types/routes';

export default function createRoutes<T>(routes: Route<T>): Route<T> {
  return routes;
}
