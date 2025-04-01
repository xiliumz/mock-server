import delay from '../../src/middleware/delay';
import { Request, Response } from 'hyper-express';

describe('Delay Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call next after default delay (300ms)', () => {
    const middleware = delay();
    middleware(req as Request, res as Response, next);

    expect(next).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(300);

    expect(next).toHaveBeenCalled();
  });

  it('should call next after custom delay', () => {
    const customDelay = 500;
    const middleware = delay(customDelay);
    middleware(req as Request, res as Response, next);

    expect(next).not.toHaveBeenCalled();

    // Fast-forward time but not enough
    jest.advanceTimersByTime(400);
    expect(next).not.toHaveBeenCalled();

    // Continue to the required time
    jest.advanceTimersByTime(100);
    expect(next).toHaveBeenCalled();
  });

  it('should allow zero delay', () => {
    const middleware = delay(0);
    middleware(req as Request, res as Response, next);

    expect(next).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);

    expect(next).toHaveBeenCalled();
  });
});
