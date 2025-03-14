import { MiddlewareHandler } from 'hyper-express';

const delay: (delay?: number) => MiddlewareHandler =
  (delay = 300) =>
  (_req, _res, next) => {
    setTimeout(() => {
      next();
    }, delay);
  };

export default delay;
