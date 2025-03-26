import Route from '../types/routes';

export default function createRoute<T>(routes: Route<T>): Route<any> {
  return routes;
}
