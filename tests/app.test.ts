import buildApp from '../src/app';
import { Server, Request, Response } from 'hyper-express';
import Route from '../src/types/route';
import determineStatus from '../src/helpers/determine-status';
import handleQueryParams from '../src/services/handle-query-params';
import handleRoute from '../src/services/route-handler';
import { NotFoundError } from '../src/errors/not-found-error';

// Mock dependencies
jest.mock('hyper-express');
jest.mock('../src/helpers/determine-status');
jest.mock('../src/services/handle-query-params');
jest.mock('../src/services/route-handler');
jest.mock('../src/middleware/cors', () => jest.fn());
jest.mock('../src/middleware/logger', () => jest.fn());
jest.mock('../src/middleware/delay', () => jest.fn(() => jest.fn()));

describe('buildApp', () => {
  let mockServer: jest.Mocked<Server>;
  let mockRoutes: Route<Record<string, unknown>>[];

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock Server class
    mockServer = {
      use: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Server>;

    (Server as jest.Mock).mockImplementation(() => mockServer);

    // Mock routes
    mockRoutes = [
      {
        path: '/test',
        method: 'get',
        response: { data: 'test data' },
      },
      {
        path: '/users',
        method: 'post',
        response: { data: 'user created' },
      },
    ];
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
});
