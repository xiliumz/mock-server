import { faker } from '@faker-js/faker';
import Route from '../types/routes';
import DataGeneration from '../types/data-generation-type';

export default function generateMockResponse<T extends Record<string, DataGeneration>>(
  responseTemplate: Route<T>['response'],
  isGenerated = true
) {
  if (!isGenerated) return responseTemplate;

  const response = {} as Record<string, unknown>;

  Object.entries(responseTemplate).forEach(([key, fakerPath]) => {
    const fakerPathArray = fakerPath.split('.');

    switch (fakerPathArray[0]) {
      case 'lorem':
        response[key] = faker.lorem.words({ min: Number(fakerPathArray[1]), max: Number(fakerPathArray[2]) });
        break;
      case 'number':
        response[key] = faker.number.int({ min: Number(fakerPathArray[1]), max: Number(fakerPathArray[2]) });
        break;
      case 'boolean':
        response[key] = faker.datatype.boolean();
        break;
      case 'past':
        response[key] = faker.date.past();
        break;
      case 'future':
        response[key] = faker.date.future();
        break;
      default:
        // Handle other cases or use a safe fallback
        response[key] = fakerPath as unknown;
    }
  });

  return response;
}
