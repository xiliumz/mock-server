import buildApp from '../src/app';
import { Server, Request, Response } from 'hyper-express';
import Route from '../src/types/route';
import determineStatus from '../src/helpers/determine-status';
import handleQueryParams from '../src/services/handle-query-params';
import { NotFoundError } from '../src/errors/not-found-error';

// Mocking dependencies
jest.mock('hyper-express', () => {
  const mockServer = {
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  return {
    Server: jest.fn(() => mockServer),
  };
});

jest.mock('../src/helpers/determine-status');
jest.mock('../src/services/handle-query-params');
jest.mock('../src/middleware/cors', () => jest.fn());
jest.mock('../src/middleware/logger', () => jest.fn());
jest.mock('../src/middleware/delay', () => jest.fn(() => jest.fn()));

describe('buildApp', () => {
  let mockServer: jest.Mocked<Server>;
  let mockRoutes: Route<Record<string, unknown>>[];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create new instance for each test
    buildApp([]);
    mockServer = new Server() as unknown as jest.Mocked<Server>;

    // Sample routes for testing
    mockRoutes = [
      {
        path: '/test',
        method: 'get',
        response: { data: 'test data' },
      },
      {
        path: '/users',
        method: 'post',
        response: { id: 1, name: 'John Doe' },
      },
    ];

    (determineStatus as jest.Mock).mockReturnValue(200);
  });

  it('should create a server instance', () => {
    buildApp([]);
    expect(Server).toHaveBeenCalled();
  });

  it('should apply global middleware', () => {
    // Create a fresh mock server for this test
    jest.clearAllMocks();
    buildApp([]);

    // There should be exactly 3 middleware registrations - cors, logger, and delay
    expect(mockServer.use).toHaveBeenCalledTimes(3);
  });

  it('should register routes correctly', () => {
    buildApp(mockRoutes, false);

    expect(mockServer.get).toHaveBeenCalledWith('/test', expect.any(Function));
    expect(mockServer.post).toHaveBeenCalledWith('/users', expect.any(Function));
  });

  it('should handle route execution correctly', async () => {
    // Get route handler function
    buildApp(mockRoutes, false);
    const getHandler = (mockServer.get as jest.Mock).mock.calls[0][1];

    // Mock request and response
    const mockReq: Partial<Request> = {};
    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Execute handler
    await getHandler(mockReq, mockRes);

    // Verify interactions
    expect(determineStatus).toHaveBeenCalledWith('get');
    expect(handleQueryParams).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: 'test data' });
  });

  it('should handle errors in route execution', async () => {
    // Mock an error in handleQueryParams
    (handleQueryParams as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    // Get route handler function
    buildApp(mockRoutes, false);
    const getHandler = (mockServer.get as jest.Mock).mock.calls[0][1];

    // Mock request and response
    const mockReq: Partial<Request> = {};
    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Execute handler
    await getHandler(mockReq, mockRes);

    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

    consoleErrorSpy.mockRestore();
  });

  it('should handle function responses correctly', async () => {
    const mockFunctionResponse = jest.fn((req) => ({ dynamic: 'data', query: req.query }));
    const functionRoute: Route<Record<string, unknown>> = {
      path: '/func-test',
      method: 'get',
      response: mockFunctionResponse,
    };

    buildApp([functionRoute], false);
    const getHandler = (mockServer.get as jest.Mock).mock.calls[0][1];

    const mockReq: Partial<Request> = { query: { param: 'value' } };
    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getHandler(mockReq, mockRes);

    expect(determineStatus).toHaveBeenCalledWith('get');
    expect(mockFunctionResponse).toHaveBeenCalledWith(mockReq);
    expect(handleQueryParams).not.toHaveBeenCalled(); // Should not be called for function responses
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ dynamic: 'data', query: { param: 'value' } });
  });

  it('should handle async function responses correctly', async () => {
    const mockAsyncFunctionResponse = jest.fn(async (req) => {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async work
      return { asyncData: 'fetched', path: req.path };
    });
    const asyncFunctionRoute: Route<Record<string, unknown>> = {
      path: '/async-func-test',
      method: 'post',
      response: mockAsyncFunctionResponse,
    };

    (determineStatus as jest.Mock).mockReturnValue(201); // POST should return 201

    buildApp([asyncFunctionRoute], false);
    const postHandler = (mockServer.post as jest.Mock).mock.calls[0][1];

    const mockReq: Partial<Request> = { path: '/async-func-test' };
    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await postHandler(mockReq, mockRes);

    expect(determineStatus).toHaveBeenCalledWith('post');
    expect(mockAsyncFunctionResponse).toHaveBeenCalledWith(mockReq);
    expect(handleQueryParams).not.toHaveBeenCalled(); // Should not be called for function responses
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ asyncData: 'fetched', path: '/async-func-test' });
  });

  it('should handle NotFoundError correctly', async () => {
    // Define a route where the handler function throws NotFoundError
    const errorRoute: Route<Record<string, unknown>> = {
      path: '/not-found',
      method: 'get',
      response: async (req) => {
        throw new NotFoundError('Resource not found');
      },
    };

    buildApp([errorRoute], false);
    const getHandler = (mockServer.get as jest.Mock).mock.calls[0][1];

    const mockReq: Partial<Request> = {};
    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock console.error to ensure it's NOT called for NotFoundError
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await getHandler(mockReq, mockRes);

    // Verify NotFoundError handling
    expect(determineStatus).not.toHaveBeenCalled(); // Status determination happens after response generation/error
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Resource not found' });
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // console.error should not be called

    consoleErrorSpy.mockRestore();
  });

  it('should handle invalid response types in route configuration', async () => {
    const invalidRoute: Route<Record<string, unknown>> = {
      path: '/invalid',
      method: 'get',
      // @ts-expect-error Testing invalid type
      response: 'this is not a valid response type',
    };

    buildApp([invalidRoute], false);
    const getHandler = (mockServer.get as jest.Mock).mock.calls[0][1];

    const mockReq: Partial<Request> = {};
    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await getHandler(mockReq, mockRes);

    // Verify error handling for invalid response type
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Invalid response type for GET /invalid:`, 'string');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid route configuration: response type' });

    consoleErrorSpy.mockRestore();
  });
});
