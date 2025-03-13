import { faker } from "@faker-js/faker";
import Route from '../types/routes';

// Function to dynamically generate Faker data based on template
export default function generateMockResponse(responseTemplate: Route['response']) {
  const response: Route['response'] = {};

  for (const k in responseTemplate) {
    const key = k as keyof Route['response']
    const fakerPath = responseTemplate[key]

    if (typeof fakerPath !== 'string') return

    let fakerFunc: any = faker;
    try {
      // Traverse Faker.js object to execute function
      fakerPath.split('.').forEach(part => fakerFunc = fakerFunc[part]);
      response[key] = typeof fakerFunc === "function" ? fakerFunc() : fakerFunc;
    } catch (error) {
      response[key] = `Invalid Faker key: ${responseTemplate[key]}`;
    }
  }
  return response;
}
