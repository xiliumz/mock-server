import Route from '../types/routes';

export default function createRoute<T>(route: Route<T>): Route<any> {
  return route;
}
