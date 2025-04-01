import getQueryParamsValue from '../../src/helpers/get-query-params-value';
import { Request } from 'hyper-express';

describe('getQueryParamsValue', () => {
  it('should return the value for a valid query parameter', () => {
    const req = {
      query: {
        testParam: 'testValue',
      },
    } as unknown as Request;

    expect(getQueryParamsValue(req, 'testParam')).toBe('testValue');
  });

  it('should trim parameter name before searching', () => {
    const req = {
      query: {
        testParam: 'testValue',
      },
    } as unknown as Request;

    expect(getQueryParamsValue(req, ' testParam ')).toBe('testValue');
  });

  it('should return the first value if parameter is an array', () => {
    const req = {
      query: {
        testParam: ['value1', 'value2'],
      },
    } as unknown as Request;

    expect(getQueryParamsValue(req, 'testParam')).toBe('value1');
  });

  it('should return undefined if parameter value is not a string', () => {
    const req = {
      query: {
        testParam: 123,
      },
    } as unknown as Request;

    expect(getQueryParamsValue(req, 'testParam')).toBeUndefined();
  });

  it('should return undefined if parameter does not exist', () => {
    const req = {
      query: {},
    } as unknown as Request;

    expect(getQueryParamsValue(req, 'nonExistentParam')).toBeUndefined();
  });
});
