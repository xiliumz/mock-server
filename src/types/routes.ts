import HTTPMethod from './http-method'

export default interface Route {
  path: string

  method: HTTPMethod

  response: Record<string, string>
}
