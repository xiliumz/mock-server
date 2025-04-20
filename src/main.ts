import buildApp from './app';
import * as routes from './routes';
import Route from './types/route';

// Create server
const app = buildApp(Object.values(routes) as unknown as Route<any>[]);

app.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000 🚀');
});
