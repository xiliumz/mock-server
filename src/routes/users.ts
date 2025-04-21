import { faker } from '@faker-js/faker';
import createRoute from '../helpers/create-routes';

type User = {
  id: string;
  name: string;
  email: string;
};

/**
 * GET /users
 * Returns a static list of users.
 */
export const index = createRoute<{ users: User[] }>({
  path: '/users',
  method: 'get',
  response: {
    users: Array.from({ length: 10 }).map(() => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    })),
  },
});
