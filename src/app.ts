import { Server } from 'hyper-express';
import logger from './middleware/logger';
import Route from './types/routes';
import determineStatus from './helpers/determine-status';
import generateMockResponse from './services/generate-mock-response';

export default function buildApp(routes: Route[]) {
  // Create Hyper Express server
  const app = new Server();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(204).end();

    next();
  });

  app.use(logger);

  // Register mock routes dynamically
  routes.forEach(({ path, method, response, isGenerated = true }) => {
    app[method](path, (_req, res) => {
      if (isGenerated) {
        res.status(determineStatus(method)).json(generateMockResponse(response));
      } else {
        res.status(determineStatus(method)).json(response)
      }
    });

    console.log(`Registered mock route: ${method.toUpperCase()} ${path}`);
  });

  return app;
}
