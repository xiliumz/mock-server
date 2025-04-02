# Mock Server

A simple and flexible mock server built with TypeScript and Hyper Express to simulate API endpoints for development and testing purposes.

## Features

- RESTful API mock endpoints
- Query parameter support for filtering data
- Fake data generation using Faker.js
- CORS support
- Request logging
- Configurable response delay

## Installation

```bash
# Clone the repository
git clone https://github.com/xiliumz/mock-server.git
cd mock-server

# Install dependencies
yarn install
```

## Usage

### Starting the server

```bash
# Build and start the server
yarn start
```

The server will run at http://localhost:3000

### Running tests

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn run test:watch
```

## API Endpoints

### Products

- `GET /products` - Get a list of products with pagination support

  - Query parameters:
    - `offset` - Number of items to skip (default: 0)
    - `limit` - Maximum number of items to return (default: 10)

- `GET /products/:id` - Get a single product by ID

## Adding New Routes

Add new route files in the `src/routes` directory and export them in `src/routes/index.ts`.

## Project Structure

```
mock-server/
├── src/
│   ├── app.ts            # Server configuration
│   ├── main.ts           # Entry point
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── types/            # TypeScript type definitions
│   ├── helpers/          # Utility functions
│   └── middleware/       # Express middleware
├── tests/                # Test files
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Technologies

- TypeScript
- Hyper Express
- Faker.js
- Jest (for testing)

## License

ISC
