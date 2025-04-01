import cors from '../../src/middleware/cors';
import { Request, Response } from 'hyper-express';

describe('CORS Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  });

  it('should set CORS headers', () => {
    req = { method: 'GET' };

    cors(req as Request, res as Response, next);

    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    expect(next).toHaveBeenCalled();
  });

  it('should handle OPTIONS requests with 204 status and end response', () => {
    req = { method: 'OPTIONS' };

    cors(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
