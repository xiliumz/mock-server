import Lorem from './generation-data/lorem'
import Number from './generation-data/number'
import Array from './generation-data/array'

/**
 * Type representing all possible data generation formats.
 * 
 * This includes:
 * - Lorem: For generating lorem ipsum text
 * - Number: For generating random numbers
 * - Date types: 'past' and 'future' for generating dates
 * - Boolean: For generating random boolean values
 * - Array: For generating arrays of various data types
 * 
 */
type DataGeneration = Lorem | Number | 'past' | 'future' | 'boolean' | Array

export default DataGeneration
