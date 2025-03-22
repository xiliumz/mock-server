import { faker } from '@faker-js/faker';
import buildApp from './app';
import createRoutes from './helpers/create-routes';

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

// Create server
const app = buildApp([productsRoute]);

app.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000 🚀');
});
