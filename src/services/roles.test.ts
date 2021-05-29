import { hasRole, addRole, removeRole } from './roles';

describe('Roles', () => {
  it('should not have role 1', () => {
    expect(hasRole(2, 1)).toBe(false);
  });

  it('should have role 1', () => {
    expect(hasRole(3, 1)).toBe(true);
  });

  it('should add role 2', () => {
    expect(addRole(1, 2)).toBe(3);
  });

  it('should remove role 2', () => {
    expect(removeRole(7, 2)).toBe(5);
  });
});
