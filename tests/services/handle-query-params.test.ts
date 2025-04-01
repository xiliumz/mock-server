import handleQueryParams from '../../src/services/handle-query-params';
import getQueryParamsValue from '../../src/helpers/get-query-params-value';
import { Request } from 'hyper-express';
import { QueryParam } from '../../src/types/query-param';

// Mock the getQueryParamsValue helper
jest.mock('../../src/helpers/get-query-params-value');

describe('handleQueryParams', () => {
  let mockRequest: Partial<Request>;
  let mockResult: Record<string, unknown>;
  let mockQueryParams: QueryParam<Record<string, unknown>>[];

  beforeEach(() => {
    mockRequest = {};
    mockResult = { data: 'test' };

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should not modify result if queryParams is undefined', () => {
    const originalResult = { ...mockResult };

    handleQueryParams(mockRequest as Request, mockResult, undefined);

    expect(mockResult).toEqual(originalResult);
    expect(getQueryParamsValue).not.toHaveBeenCalled();
  });

  it('should not modify result if queryParams is empty array', () => {
    const originalResult = { ...mockResult };

    handleQueryParams(mockRequest as Request, mockResult, []);

    expect(mockResult).toEqual(originalResult);
    expect(getQueryParamsValue).not.toHaveBeenCalled();
  });

  it('should call handler for each query parameter with its value', () => {
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();

    mockQueryParams = [
      { name: 'param1', handler: mockHandler1 },
      { name: 'param2', handler: mockHandler2 },
    ];

    // Setup return values for getQueryParamsValue
    (getQueryParamsValue as jest.Mock).mockReturnValueOnce('value1');
    (getQueryParamsValue as jest.Mock).mockReturnValueOnce('value2');

    handleQueryParams(mockRequest as Request, mockResult, mockQueryParams);

    expect(getQueryParamsValue).toHaveBeenCalledTimes(2);
    expect(getQueryParamsValue).toHaveBeenCalledWith(mockRequest, 'param1');
    expect(getQueryParamsValue).toHaveBeenCalledWith(mockRequest, 'param2');

    expect(mockHandler1).toHaveBeenCalledWith(mockResult, 'value1');
    expect(mockHandler2).toHaveBeenCalledWith(mockResult, 'value2');
  });

  it('should call handler with undefined if parameter value is not found', () => {
    const mockHandler = jest.fn();

    mockQueryParams = [{ name: 'param', handler: mockHandler }];

    // Setup return values for getQueryParamsValue
    (getQueryParamsValue as jest.Mock).mockReturnValueOnce(undefined);

    handleQueryParams(mockRequest as Request, mockResult, mockQueryParams);

    expect(getQueryParamsValue).toHaveBeenCalledWith(mockRequest, 'param');
    expect(mockHandler).toHaveBeenCalledWith(mockResult, undefined);
  });
});
