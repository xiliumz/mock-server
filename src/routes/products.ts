import createRoute from '../helpers/create-routes';

export const index = createRoute({
  path: '/products',
  method: 'get',
  response: {
    products: Array.from({ length: 25 }).map(() => ({
      id: 'uuid',
      name: 'lorem.2.4',
      description: 'lorem.5.10',
      price: 'number.1.100',
    })),
  },
});

export const show = createRoute({
  path: '/products/:id',
  method: 'get',
  response: {
    id: 'uuid',
    name: 'lorem.2.4',
    description: 'lorem.5.10',
    price: 'number.1.100',
    company: {
      id: 'uuid',
      name: 'lorem.2.4',
      description: 'lorem.5.10',
    },
  },
});
