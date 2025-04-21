import { Server } from 'hyper-express';
import buildApp from '../src/app';
import Route from '../src/types/route';

// Mock dependencies
jest.mock('hyper-express');
jest.mock('../src/services/route-handler');

describe('buildApp', () => {
  let mockServer: jest.Mocked<Server>;
  let mockRoutes: Route<Record<string, unknown>>[];
  let mockHandleRoute: jest.Mock;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock handleRoute
    mockHandleRoute = jest.fn();
    jest.requireMock('../src/services/route-handler').default = mockHandleRoute;

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

    (mockServer.get as jest.Mock).mockImplementation((path, handler) => {
      handler();
    });

    expect(mockServer.get).toHaveBeenCalledWith('/test', expect.any(Function));
    expect(mockServer.post).toHaveBeenCalledWith('/users', expect.any(Function));
  });

  it('should call handleRoute with correct arguments when handling requests', () => {
    const mockReq = {};
    const mockRes = {};

    buildApp(mockRoutes, false);

    // Get the handler function that was registered
    const [[, getHandler]] = (mockServer.get as jest.Mock).mock.calls;
    const [[, postHandler]] = (mockServer.post as jest.Mock).mock.calls;

    // Call both handlers
    getHandler(mockReq, mockRes);
    postHandler(mockReq, mockRes);

    // Verify handleRoute was called with correct arguments
    expect(mockHandleRoute).toHaveBeenCalledTimes(2);
    expect(mockHandleRoute).toHaveBeenNthCalledWith(1, mockRoutes[0], mockReq, mockRes);
    expect(mockHandleRoute).toHaveBeenNthCalledWith(2, mockRoutes[1], mockReq, mockRes);
  });
});
