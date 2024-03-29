import JwtService from './jwt';

const jwtData = { id: 1, roles: 123 };
const obsoleteJwt =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QiLCJyb2xlcyI6MTIzLCJpYXQiOjE1NzIwODMwNDUsImV4cCI6MTU3MjA4MzA1Mn0.Y7D_AAssUpNnIADTK2uesesKgwvlJZ0wbqIxibwOhq-L5874UoWdIF1RvNbO8DPx963KPsBrIE-24yRkDZpmqA';

describe('JwtService', () => {
  it('should encode', () => {
    JwtService.create(jwtData);
  });

  it('should decode and verify', () => {
    const jwt = JwtService.create(jwtData);
    const data = JwtService.verify(jwt);
    expect(data.id).toBe(jwtData.id);
    expect(data.roles).toBe(jwtData.roles);
  });

  it('should not throw at obsolete jwt', () => {
    JwtService.verify(obsoleteJwt, { ignoreExpiration: true });
  });

  it('should throw at obsolete jwt', () => {
    expect(() => JwtService.verify(obsoleteJwt)).toThrow();
  });
});
