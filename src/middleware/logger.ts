import { MiddlewareHandler } from 'hyper-express';

const logger: MiddlewareHandler = (req, res, next) => {
  const startTime = Date.now();
  console.log(`[Request] ${req.method} ${req.originalUrl}`);

  // When the response finishes, log the status and time taken
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[Response] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
}

export default logger
