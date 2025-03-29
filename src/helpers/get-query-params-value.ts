import { Request } from 'hyper-express';

const getQueryParamsValue = (req: Request, name: string) => {
  const value = req.query[name.trim()];

  const result = Array.isArray(value) ? value[0] : value;

  if (typeof result === 'string') return result;

  return undefined;
};

export default getQueryParamsValue;
