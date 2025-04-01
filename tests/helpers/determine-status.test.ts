import determineStatus from '../../src/helpers/determine-status';

describe('determineStatus', () => {
  it('should return 200 for GET requests', () => {
    expect(determineStatus('get')).toBe(200);
  });

  it('should return 201 for POST requests', () => {
    expect(determineStatus('post')).toBe(201);
  });

  it('should return 200 for PUT requests', () => {
    expect(determineStatus('put')).toBe(200);
  });

  it('should return 200 for PATCH requests', () => {
    expect(determineStatus('patch')).toBe(200);
  });

  it('should return 204 for DELETE requests', () => {
    expect(determineStatus('delete')).toBe(204);
  });

  it('should return 200 for unrecognized methods', () => {
    // @ts-ignore - Testing the default case with an invalid method
    expect(determineStatus('unknown')).toBe(200);
  });
});
