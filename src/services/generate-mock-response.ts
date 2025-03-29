import { faker } from '@faker-js/faker';
import Route from '../types/route';

export default function generateMockResponse<T extends Record<string, unknown>>(
  responseTemplate: Route<T>['response']
): Record<string, unknown> {
  const response = {} as Record<string, unknown>;

  Object.entries(responseTemplate).forEach(([key, value]) => {
    // Handle arrays by applying generation to each element
    if (Array.isArray(value)) {
      response[key] = value.map((item) => {
        if (typeof item === 'string') {
          // If array element is a string, apply data generation
          return generateSingleValue(item);
        } else if (typeof item === 'object') {
          // If array element is an object, recursively generate its properties
          return generateMockResponse(item);
        }
        return item;
      });
    } else if (typeof value === 'string') {
      // Handle non-array string values with data generation
      response[key] = generateSingleValue(value);
    } else {
      // Pass through any other values
      response[key] = value;
    }
  });

  return response;
}

// Helper function to generate a single value based on faker path
function generateSingleValue(fakerPath: string): unknown {
  const fakerPathArray = fakerPath.split('.');

  switch (fakerPathArray[0]) {
    case 'uuid':
      return faker.string.uuid();
    case 'lorem':
      return faker.lorem.words({ min: Number(fakerPathArray[1]), max: Number(fakerPathArray[2]) });
    case 'number':
      return faker.number.int({ min: Number(fakerPathArray[1]), max: Number(fakerPathArray[2]) });
    case 'boolean':
      return faker.datatype.boolean();
    case 'past':
      return faker.date.past();
    case 'future':
      return faker.date.future();
    default:
      // Handle other cases or use a safe fallback
      return fakerPath;
  }
}
