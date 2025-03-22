/**
 * A custom string template literal type for random **lorem ipsum** generation.
 *
 * The literal format is:
 * - `lorem`: Generate 1 **lorem ipsum** paragraph
 * - `lorem.<min>`: Uses `<min>` as the minimal value for generating a lorem ipsum word length.
 * - `lorem.<min>.<max>`: Uses `<min>` as the minimal value and `<max>` as the maximal value for generating a lorem ipsum word length.
 *
 * @example
 * // Valid values:
 * const value1: Lorem = 'lorem.10';    // Random lorem ipsum word with a length minimum of 10.
 * const value2: Lorem = 'lorem.5.20';   // Random for generating a lorem ipsum word length between 5 word (min) and 20 word (max).
 */
type Lorem = 'lorem' | `lorem.${number}`

export default Lorem
