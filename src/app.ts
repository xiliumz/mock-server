import { Server } from 'hyper-express';
import logger from './middleware/logger';
import Route from './types/routes';
import determineStatus from './helpers/determine-status';
import generateMockResponse from './services/generate-mock-response';

export default function buildApp(routes: Route[]) {
  // Create Hyper Express server
  const app = new Server();

  app.use(logger);

  // Register mock routes dynamically
  routes.forEach(({ path, method, response }) => {
    app[method](path, (_req, res) => {
      res.status(determineStatus(method)).json(generateMockResponse(response));
    });

    console.log(`Registered mock route: ${method.toUpperCase()} ${path}`);
  });

  return app;
}
