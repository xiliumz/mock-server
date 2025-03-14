/**
 * Represents query parameters with a name and an action handler.
 *
 * @template T - The type of data passed to the handler.
 */
export interface QueryParams<T> {
  /**
   * The name of the query parameter.
   */
  name: string;

  /**
   * The function that executes the desired action using the query parameter.
   *
   * @param data - The current data context.
   * @param value - The query parameter value.
   */
  handler: (data: T, value: string) => void;
}
