import { da, faker } from '@faker-js/faker';
import buildApp from './app';
import createRoutes from './helpers/create-routes';
import Route from './types/routes';

// Global mock routes with Faker function mappings
const productsRoute = createRoutes({
  path: '/products',
  method: 'get',
  response: {
    products: Array.from({ length: 50 }).map(() => ({
      /** Unique identifier for the product. */
      id: faker.string.uuid(),

      /** Name of the product. */
      name: faker.commerce.productName(),

      /** Description of the product. */
      description: faker.commerce.productDescription(),

      /** Price of the product. */
      price: faker.commerce.price(),

      /** Category of the product. */
      category: faker.commerce.department(),

      /** Stock quantity. */
      stock: faker.number.int({ min: 0, max: 1000 }),

      /** Rating from 1 to 5. */
      rating: faker.number.int({ min: 1, max: 5 }),

      /** Whether the product is in stock. */
      in_stock: faker.datatype.boolean(),
    })),
    count: 50,
  },
  isGenerated: false,
  queryParams: [
    {
      name: 'offset',
      handler: (data, value) => {
        const count = data.products.length;
        const filtered = data.products.slice(parseInt(value));
        data.products = filtered;
        data.count = count;
      },
    },
    {
      name: 'limit',
      handler: (data, value) => {
        const filtered = data.products.slice(0, parseInt(value));
        data.products = filtered;
      },
    },
  ],
});

const productByIdRoute: Route<any> = createRoutes({
  path: '/products/:id',
  method: 'get',
  response: {
    /** Unique identifier for the product. */
    id: 'uuid',

    /** Name of the product. */
    name: 'lorem.2.4',

    /** Description of the product. */
    description: 'lorem.5.10',

    /** Price of the product. */
    price: 'lorem.1.1',

    /** Category of the product. */
    category: 'lorem.1.1',

    /** Stock quantity. */
    stock: 'number.0.1000',

    /** Rating from 1 to 5. */
    rating: 'number.1.5',

    /** Whether the product is in stock. */
    in_stock: 'boolean',
  },
  isGenerated: true,
  queryParams: [
    {
      name: 'not_found',
      handler: (_data, value) => {
        if (value === 'true') {
          throw new Error('Product not found');
        }
      },
    },
  ],
});

// Create server
const app = buildApp([productsRoute, productByIdRoute]);

app.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000 🚀');
});
