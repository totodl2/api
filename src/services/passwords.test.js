const PasswordsService = require('./passwords');

describe('PasswordService', () => {
  it('should hash and compare password', async () => {
    const password = await PasswordsService.hash('test');
    expect(password).toBeDefined();
    expect(await PasswordsService.compare('test', password)).toBe(true);
  });
});
