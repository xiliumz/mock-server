import { Server } from "hyper-express";
import { faker } from "@faker-js/faker"; // Import Faker.js
import Route from './types/routes';
import logger from './middleware/logger';
import determineStatus from './helpers/determine-status';

// Global mock routes with Faker function mappings
const mockRoutes: Route[] = [
  { path: "/users", method: "get", response: { id: "string.uuid", name: "person.fullName", email: "internet.email" } },
  { path: "/products", method: "get", response: { id: "string.uuid", name: "commerce.productName", price: "commerce.price" } },
  { path: "/addresses", method: "get", response: { street: "location.streetAddress", city: "location.city", country: "location.country" } },
];

// Function to dynamically generate Faker data based on template
function generateMockResponse(responseTemplate: Route['response']) {
  const response: Route['response'] = {};

  for (const k in responseTemplate) {
    const key = k as keyof Route['response']
    const fakerPath = responseTemplate[key].split("."); // Split function path (e.g., "person.fullName")

    let fakerFunc: any = faker;
    try {
      // Traverse Faker.js object to execute function
      fakerPath.forEach(part => fakerFunc = fakerFunc[part]);
      response[key] = typeof fakerFunc === "function" ? fakerFunc() : fakerFunc;
    } catch (error) {
      response[key] = `Invalid Faker key: ${responseTemplate[key]}`;
    }
  }
  return response;
}

// Create Hyper Express server
const app = new Server();

app.use(logger);

// Register mock routes dynamically
mockRoutes.forEach(({ path, method, response }) => {
  app[method](path, (_req, res) => {
    res.status(determineStatus(method)).json(generateMockResponse(response));
  });

  console.log(`Registered mock route: ${method.toUpperCase()} ${path}`);
});

// Start the server
app.listen(3000, () => console.log("Mock Server running at http://localhost:3000 🚀"));
