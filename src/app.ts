import { Server, Request, Response } from 'hyper-express';
import determineStatus from './helpers/determine-status';
import cors from './middleware/cors';
import logger from './middleware/logger';
import Route from './types/route';
import delay from './middleware/delay';
import handleRoute from './services/route-handler';

/**
 * Builds and configures a Hyper Express server with mock routes
 * @template T - The type of the response data
 * @param routes - Array of route configurations
 * @param log - if true, log the registered routes
 * @returns Configured Hyper Express server instance
 */
export default function buildApp<T extends Record<string, unknown>>(routes: Route<T>[], log = true): Server {
  const app = new Server();

  // Apply global middleware
  app.use(cors);
  app.use(logger);
  app.use(delay());

  // Register mock routes
  routes.forEach((route) => {
    const { path, method } = route;

    // Simplified route handler using the extracted function
    const handler = (req: Request, res: Response) => {
      // No try-catch needed here as handleRoute handles errors internally
      handleRoute(route, req, res);
    };

    // Register the route
    app[method](path, handler);
    if (log) {
      console.log(`Registered mock route: ${method.toUpperCase()} ${path}`);
    }
  });

  return app;
}
