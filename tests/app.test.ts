import buildApp from '../src/app';
import { Server, Request, Response } from 'hyper-express';
import Route from '../src/types/route';
import determineStatus from '../src/helpers/determine-status';
import handleQueryParams from '../src/services/handle-query-params';

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
    buildApp(mockRoutes);

    expect(mockServer.get).toHaveBeenCalledWith('/test', expect.any(Function));
    expect(mockServer.post).toHaveBeenCalledWith('/users', expect.any(Function));
  });

  it('should handle route execution correctly', async () => {
    // Get route handler function
    buildApp(mockRoutes);
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
    buildApp(mockRoutes);
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
});
