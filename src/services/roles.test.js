const Roles = require('./roles');

describe('Roles', () => {
  it('should not have role 1', () => {
    expect(Roles.hasRole(2, 1)).toBe(false);
  });

  it('should have role 1', () => {
    expect(Roles.hasRole(3, 1)).toBe(true);
  });

  it('should add role 2', () => {
    expect(Roles.add(1, 2)).toBe(3);
  });

  it('should remove role 2', () => {
    expect(Roles.remove(7, 2)).toBe(5);
  });
});
