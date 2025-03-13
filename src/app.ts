import { Server } from 'hyper-express';
import determineStatus from './helpers/determine-status';
import getQueryParamsValue from './helpers/get-query-params-value';
import cors from './middleware/cors';
import logger from './middleware/logger';
import generateMockResponse from './services/generate-mock-response';
import Route from './types/routes';

export default function buildApp<T extends Record<string, unknown>>(routes: Route<T>[]) {
  // Create Hyper Express server
  const app = new Server();

  app.use(cors);
  app.use(logger);

  // Register mock routes dynamically
  routes.forEach(({ path, method, response, isGenerated = true, queryParams }) => {
    const data = isGenerated ? generateMockResponse(response) : response;

    app[method](path, (req, res) => {
      if (queryParams) {
        const value = getQueryParamsValue(req, queryParams.name);
        if (value) queryParams.handler(data as T, value);
      }
      res.status(determineStatus(method)).json(data);
    });

    console.log(`Registered mock route: ${method.toUpperCase()} ${path}`);
  });

  return app;
}
