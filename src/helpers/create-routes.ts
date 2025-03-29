import Route from '../types/route';

export default function createRoute<T>(route: Route<T>): Route<any> {
  return route;
}
