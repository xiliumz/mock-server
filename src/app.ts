import { Server } from 'hyper-express';
import determineStatus from './helpers/determine-status';
import getQueryParamsValue from './helpers/get-query-params-value';
import cors from './middleware/cors';
import logger from './middleware/logger';
import generateMockResponse from './services/generate-mock-response';
import Route from './types/routes';
import delay from './middleware/delay';

export default function buildApp<T extends Record<string, unknown>>(routes: Route<T>[]) {
  // Create Hyper Express server
  const app = new Server();
  app.use(logger);

  app.use(cors);
  app.use(delay(2000));

  // Register mock routes dynamically
  routes.forEach(({ path, method, response, isGenerated = true, queryParams }) => {
    /** Initial generated data. This data should be presistent */
    const data = isGenerated ? generateMockResponse(response) : response;

    app[method](path, (req, res) => {
      /** This is the data that will be sent and added filter */
      const result = { ...data };
      if (queryParams && queryParams.length > 0) {
        queryParams.forEach((param) => {
          const value = getQueryParamsValue(req, param.name);
          if (value) param.handler(result as T, value);
        });
      }
      res.status(determineStatus(method)).json(result);
    });

    console.log(`Registered mock route: ${method.toUpperCase()} ${path}`);
  });

  return app;
}
