import { Router } from 'hyper-express';

export default interface Route {
  path: string

  method: 'get' | 'post'

  response: Record<string, string>
}
