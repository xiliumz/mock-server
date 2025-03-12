import HTTPMethod from '../types/http-method'

/**
 * Determines the default HTTP status code based on the provided HTTP method.
 *
 * @param method - The HTTP method for which to determine the status code.
 * @returns The default status code corresponding to the HTTP method.
 *
 * @example
 * // Returns 200 for GET requests
 * determineStatus('GET');
 *
 * @example
 * // Returns 201 for POST requests
 * determineStatus('POST');
 */
const determineStatus: (method: HTTPMethod) => number = (method) => {
  switch (method) {
    case 'get':
      return 200;
    case 'post':
      return 201;
    case 'put':
    case 'patch':
      return 200;
    case 'delete':
      return 204;
    // Add additional HTTP methods as needed.
    default:
      // Fallback to a generic status code if the method is unrecognized.
      return 200;
  }
}

export default determineStatus;
