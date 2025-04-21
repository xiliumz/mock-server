import { Request, Response } from 'hyper-express';
import handleRoute from '../../src/services/route-handler';
import determineStatus from '../../src/helpers/determine-status';
import handleQueryParams from '../../src/services/handle-query-params';
import { NotFoundError } from '../../src/errors/not-found-error';
import Route from '../../src/types/route';
import { QueryParam } from '../../src/types/query-param';

// Mock dependencies
jest.mock('../../src/helpers/determine-status');
jest.mock('../../src/services/handle-query-params');

describe('handleRoute', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      path: '',
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock determineStatus to return appropriate status codes
    (determineStatus as jest.Mock).mockImplementation((method) => {
      switch (method) {
        case 'post':
          return 201;
        default:
          return 200;
      }
    });
  });

  it('should handle static response correctly', async () => {
    const route: Route<Record<string, unknown>> = {
      path: '/test',
      method: 'get',
      response: { data: 'test data' },
    };

    await handleRoute(route, mockReq as Request, mockRes as Response);

    expect(determineStatus).toHaveBeenCalledWith('get');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: 'test data' });
  });

  it('should handle function responses correctly', async () => {
    const mockFunctionResponse = jest.fn((req) => ({ dynamic: 'data', query: req.query }));
    const route: Route<Record<string, unknown>> = {
      path: '/func-test',
      method: 'get',
      response: mockFunctionResponse,
    };

    Object.assign(mockReq, { query: { param: 'value' } });

    await handleRoute(route, mockReq as Request, mockRes as Response);

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
    const route: Route<Record<string, unknown>> = {
      path: '/async-func-test',
      method: 'post',
      response: mockAsyncFunctionResponse,
    };

    Object.assign(mockReq, { path: '/async-func-test' });

    await handleRoute(route, mockReq as Request, mockRes as Response);

    expect(determineStatus).toHaveBeenCalledWith('post');
    expect(mockAsyncFunctionResponse).toHaveBeenCalledWith(mockReq);
    expect(handleQueryParams).not.toHaveBeenCalled(); // Should not be called for function responses
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ asyncData: 'fetched', path: '/async-func-test' });
  });

  it('should handle NotFoundError correctly', async () => {
    const route: Route<Record<string, unknown>> = {
      path: '/not-found',
      method: 'get',
      response: async () => {
        throw new NotFoundError('Resource not found');
      },
    };

    await handleRoute(route, mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Resource not found' });
  });

  it('should handle query parameters for static responses', async () => {
    const route: Route<Record<string, unknown>> = {
      path: '/test',
      method: 'get',
      response: { data: 'test data', filterable: true },
      queryParams: [
        {
          name: 'filterable',
          handler: (data: Record<string, unknown>, value: string | undefined) => {
            if (value === 'true') {
              data.filterable = true;
            }
          },
        },
      ],
    };

    Object.assign(mockReq, { query: { filterable: 'true' } });

    await handleRoute(route, mockReq as Request, mockRes as Response);

    expect(handleQueryParams).toHaveBeenCalledWith(mockReq, expect.any(Object), route.queryParams);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should handle errors in query parameter processing', async () => {
    const route: Route<Record<string, unknown>> = {
      path: '/test',
      method: 'get',
      response: { data: 'test data' },
      queryParams: [
        {
          name: 'filter',
          handler: (data: Record<string, unknown>, value: string | undefined) => {
            if (value) {
              data.filtered = value;
            }
          },
        },
      ],
    };

    // Mock handleQueryParams to throw an error
    (handleQueryParams as jest.Mock).mockImplementation(() => {
      throw new Error('Query parameter processing error');
    });

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await handleRoute(route, mockReq as Request, mockRes as Response);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

    consoleErrorSpy.mockRestore();
  });

  it('should handle invalid response types in route configuration', async () => {
    const route: Route<Record<string, unknown>> = {
      path: '/invalid',
      method: 'get',
      // @ts-expect-error Testing invalid type
      response: 'this is not a valid response type',
    };

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await handleRoute(route, mockReq as Request, mockRes as Response);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid response type for GET /invalid:', 'string');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid route configuration: response type' });

    consoleErrorSpy.mockRestore();
  });
});
