import createRoute from '../helpers/create-routes';
import { NotFoundError } from '../errors/not-found-error';
import { faker } from '@faker-js/faker';

export interface Company {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  company: Company;
}

// Query parameter configurations
const offsetParam = {
  name: 'offset',
  handler: (data: { products: Product[] }, value = '0') => {
    const offset = parseInt(value, 10);
    if (isNaN(offset)) {
      console.error('Offset must be a number');
      data.products = [];
      return;
    }
    data.products = data.products.slice(offset);
  },
};

const limitParam = {
  name: 'limit',
  handler: (data: { products: Product[] }, value = '10') => {
    const limit = parseInt(value, 10);
    if (isNaN(limit)) {
      console.error('Limit must be a number');
      data.products = [];
      return;
    }
    data.products = data.products.slice(0, limit);
  },
};

/**
 * Default count of products to generate.
 */
const DEFAULT_COUNT = 50;

const allProducts = Array.from({ length: DEFAULT_COUNT }).map(() => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(2),
  description: faker.lorem.sentence(5),
  price: faker.number.int({ min: 1, max: 100 }),
  company: {
    id: faker.string.uuid(),
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(5),
  },
}));

function findProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

/**
 * GET /products
 * Returns a paginated list of products.
 */
export const index = createRoute<{ products: Product[] }>({
  path: '/products',
  method: 'get',
  response: {
    products: [...allProducts],
  },
  queryParams: [offsetParam, limitParam],
});

/**
 * GET /products/:id
 * Returns a single product by ID.
 */
export const show = createRoute<Product>({
  path: '/products/:id',
  method: 'get',
  response: (req): Product => {
    const productId = req.params.id;
    const product = findProductById(productId);
    if (!product) {
      throw new NotFoundError(`Product with id ${productId} not found`);
    }
    return product;
  },
});
