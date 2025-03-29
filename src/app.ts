import { Server, Request, Response } from 'hyper-express';
import determineStatus from './helpers/determine-status';
import cors from './middleware/cors';
import logger from './middleware/logger';
import generateMockResponse from './services/generate-mock-response';
import handleQueryParams from './services/handle-query-params';
import Route from './types/route';
import delay from './middleware/delay';
import DataGeneration from './types/data-generation-type';

/**
 * Builds and configures a Hyper Express server with mock routes
 * @template T - The type of the response data
 * @param routes - Array of route configurations
 * @returns Configured Hyper Express server instance
 */
export default function buildApp<T extends Record<string, unknown>>(routes: Route<T>[]): Server {
  const app = new Server();

  // Apply global middleware
  app.use(cors);
  app.use(logger);
  app.use(delay(2000));

  // Register mock routes
  routes.forEach((route) => {
    const { path, method, response, isGenerated = true, queryParams } = route;

    // Generate initial mock data if needed
    const initialData = generateMockResponse(response as Record<string, DataGeneration>, isGenerated)

    // Create route handler
    const handler = async (req: Request, res: Response) => {
      try {
        // Create a copy of the initial data to avoid modifying the original
        const result = { ...initialData };

        // Apply query parameter filters if any
        handleQueryParams(req, result as T, queryParams);

        // Send response with appropriate status code
        res.status(determineStatus(method)).json(result);
      } catch (error) {
        console.error(`Error handling ${method.toUpperCase()} ${path}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    // Register the route
    app[method](path, handler);
    console.log(`Registered mock route: ${method.toUpperCase()} ${path}`);
  });

  return app;
}
