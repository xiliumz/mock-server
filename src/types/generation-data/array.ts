import Lorem from './lorem'
import Number from './number'

/**
 * A type for array generation.
 * 
 * The literal format is:
 * - `array.[datatype]`: Generate an array of the specified datatype.
 * 
 * @example
 * // Valid values:
 * const value1: Array = 'array.lorem';    // Array of lorem ipsum text
 * const value2: Array = 'array.number';   // Array of numbers
 * const value3: Array = 'array.boolean';  // Array of boolean values
 */
type Array = `array.${Lorem}` | `array.${Number}` | `array.past` | `array.future` | `array.boolean`

export default Array
