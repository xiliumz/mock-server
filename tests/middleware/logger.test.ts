import logger from '../../src/middleware/logger';
import { Request, Response } from 'hyper-express';

describe('Logger Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/test'
    };
    res = {
      statusCode: 200,
      on: jest.fn()
    };
    next = jest.fn();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should call next function', () => {
    logger(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should register a finish event listener on the response', () => {
    logger(req as Request, res as Response, next);
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should log response information when response finishes', () => {
    logger(req as Request, res as Response, next);
    
    // Get the finish callback
    const finishCallback = (res.on as jest.Mock).mock.calls[0][1];
    
    // Call the finish callback
    finishCallback();
    
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Response]')
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /test - 200')
    );
  });
}); 
