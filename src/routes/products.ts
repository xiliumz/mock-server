import createRoute from '../helpers/create-routes';
import { faker } from '@faker-js/faker';
export const index = createRoute({
  path: '/products',
  method: 'get',
  response: {
    products: Array.from({ length: 50 }).map(() => ({
      id: faker.string.uuid(),
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(5),
      price: faker.number.int({ min: 1, max: 100 }),
    })),
  },
  queryParams: [
    {
      name: 'offset',
      handler: (data, value = '0') => {
        data.products = data.products.slice(parseInt(value));
      },
    },
    {
      name: 'limit',
      handler: (data, value = '10') => {
        const products = data.products.slice(0, parseInt(value));
        console.log(products);
        data.products = products;
      },
    },
  ],
});

export const show = createRoute({
  path: '/products/:id',
  method: 'get',
  response: {
    id: faker.string.uuid(),
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(5),
    price: faker.number.int({ min: 1, max: 100 }),
    company: {
      id: faker.string.uuid(),
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(5),
    },
  },
});
