import buildApp from './app';
import * as routes from './routes';
import Route from './types/route';
import { transformRoutesToPathBased } from './helpers/transform-routes';

const routesArray = Object.values(routes);
const routesByPath = transformRoutesToPathBased(routesArray);

// Create server
const app = buildApp(Object.values(routesByPath) as Route<any>[]);

app.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000 🚀');
});
