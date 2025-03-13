import { faker } from '@faker-js/faker';
import Route from '../types/routes';

export default function generateMockResponse<T extends Record<string, unknown>>(
  responseTemplate: Route<T>['response']
) {
  const response = {} as Partial<T>;

  Object.entries(responseTemplate).forEach(([key, fakerPath]) => {
    if (typeof fakerPath !== 'string') {
      console.warn(`Expected faker path as string for key "${key}", but got ${typeof fakerPath}. Skipping.`);
      return;
    }

    let fakerProperty: any = faker;
    try {
      const parts = fakerPath.split('.');
      for (const part of parts) {
        if (!(part in fakerProperty)) {
          throw new Error(`Property "${part}" does not exist on faker`);
        }
        fakerProperty = fakerProperty[part];
      }
      response[key as keyof T] = typeof fakerProperty === 'function' ? fakerProperty() : fakerProperty;
    } catch (error: any) {
      console.error(`Error processing key "${key}" with path "${fakerPath}": ${error.message}`);
      response[key as keyof T] = `Invalid Faker key: ${fakerPath}` as unknown as T[keyof T];
    }
  });

  return response;
}
