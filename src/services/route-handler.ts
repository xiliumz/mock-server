import { Request, Response } from 'hyper-express';
import determineStatus from '../helpers/determine-status';
import handleQueryParams from './handle-query-params';
import { NotFoundError } from '../errors/not-found-error';
import Route from '../types/route';

/**
 * Handles the logic for a single route, including response processing, query parameter handling, and error management.
 * @template T - The type of the response data.
 * @param route - The route configuration object.
 * @param req - The Hyper Express request object.
 * @param res - The Hyper Express response object.
 */
export default async function handleRoute<T extends Record<string, unknown>>(
  route: Route<T>,
  req: Request,
  res: Response
): Promise<void> {
  const { path, method, response, queryParams } = route;
  try {
    let responseData: T | unknown; // Use unknown for flexibility with function return

    if (typeof response === 'function') {
      // Explicitly await if the response function might be async
      responseData = await (response as (req: Request) => T | Promise<T>)(req);
    } else if (typeof response === 'object' && response !== null) {
      // Create a shallow copy of the response object
      const result = { ...response };

      // Apply query parameter filters if any
      handleQueryParams(req, result, queryParams);
      responseData = result;
    } else {
      // Handle cases where response is neither function nor object (e.g., primitive, null)
      console.error(`Invalid response type for ${method.toUpperCase()} ${path}:`, typeof response);
      res.status(500).json({ error: 'Invalid route configuration: response type' });
      return; // Stop execution if response type is invalid
    }

    // Determine the status code based on the HTTP method
    const statusCode = determineStatus(method);

    // Send the response
    res.status(statusCode).json(responseData);
  } catch (error) {
    if (error instanceof NotFoundError) {
      // Handle known NotFoundError specifically
      res.status(error.status).json({ error: error.message });
    } else {
      // Catch any other unexpected errors during route processing
      console.error(`Unexpected error handling ${method.toUpperCase()} ${path}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
