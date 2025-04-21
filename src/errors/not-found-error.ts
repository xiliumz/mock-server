/**
 * Represents an HTTP 404 Not Found error.
 * Use this error to indicate that a requested resource could not be found.
 *
 * @example
 *   throw new NotFoundError('Resource not found');
 */
export class NotFoundError extends Error {
  /**
   * The associated HTTP status code for this error.
   */
  public readonly status: number = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
