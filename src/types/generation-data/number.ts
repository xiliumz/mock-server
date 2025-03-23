/**
 * A custom integer template literal type for random number generation.
 *
 * The literal format is:
 * - `number`: Using default min max value
 * - `number.<min>`: Uses `<min>` as the minimal value for generating a random number.
 * - `number.<min>.<max>`: Uses `<min>` as the minimal value and `<max>` as the maximal value.
 *
 * @example
 * // Valid values:
 * const value1: Int = 'int.10';    // Random number with a minimum of 10.
 * const value2: Int = 'int.5.20';   // Random number between 5 (min) and 20 (max).
 */
type Number = 'number' | `number.${number}`;

export default Number;
