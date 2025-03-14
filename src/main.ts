import { faker } from '@faker-js/faker';
import buildApp from './app';
import createRoutes from './helpers/create-routes';

// Global mock routes with Faker function mappings
const rabProjectsRoute = createRoutes({
  path: '/warehouse/projects',
  method: 'get',
  response: {
    projects: Array.from({ length: 25 }).map(() => ({
      /** Unique identifier for the project. */
      id: faker.string.uuid(),

      /** Descriptive name of the project. */
      name: faker.commerce.productName(),

      /** Total number of farmers participating in the project. */
      farmer_count: faker.number.int(10),

      /** Total number of farms associated with the project. */
      farm_count: faker.number.int(10),

      /** Combined area of all farms in the project (in appropriate area units). */
      total_area: faker.number.int(100),

      /** Project start date in ISO 8601 format (e.g., YYYY-MM-DD). */
      start_date: faker.date.past().toISOString().split('T')[0],

      /** Project end date in ISO 8601 format (e.g., YYYY-MM-DD). */
      end_date: faker.date.future().toISOString().split('T')[0],

      /** Remaining budget available for the project. */
      remaining_budget: faker.number.int({ max: 1_000_000_000 }),

      /** Expected total realization */
      expected_realization: faker.number.int({ max: 1_000_000_000 }),

      /** Current realization achieved to date (e.g., actual revenue or yield). */
      current_realization: faker.number.int({ max: 1_000_000_000 }),

      /** Current operational status of the project. */
      status: faker.helpers.arrayElement(['not_started', 'ongoing', 'completed']),
    })),
    count: 25,
  },
  isGenerated: false,
  queryParams: [
    {
      name: 'offset',
      handler: (data, value) => {
        const count = data.projects.length;
        const filtered = data.projects.slice(parseInt(value));
        data.projects = filtered;
        data.count = count;
      },
    },
    {
      name: 'limit',
      handler: (data, value) => {
        const filtered = data.projects.slice(0, parseInt(value));
        data.projects = filtered;
      },
    },
  ],
});
// Create server

const app = buildApp([rabProjectsRoute]);

app.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000 🚀');
});
