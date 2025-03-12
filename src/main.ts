import buildApp from './app';
import Route from './types/routes';

// Global mock routes with Faker function mappings
const mockRoutes: Route[] = [
  { path: "/users", method: "get", response: { id: "string.uuid", name: "person.fullName", email: "internet.email" } },
  { path: "/products", method: "get", response: { id: "string.uuid", name: "commerce.productName", price: "commerce.price" } },
  { path: "/addresses", method: "get", response: { street: "location.streetAddress", city: "location.city", country: "location.country" } },
];

// Create server

const app = buildApp(mockRoutes)

app.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000 🚀')
})
