const utils = require('./utils');

test('validates a valid email address', () => {
    expect(utils.validateEmail("prova@test.it")).toBe(true);
});

test('validates an invalid email address', () => {
    expect(utils.validateEmail("this.is.wrong!")).toBe(false);
});

test('hashes a password with salt', () => {
    expect(utils.hashPassword("prova1234", "2ca51e5f")).toBe('1f1b6834ed383539cc5e35412e2b1c6e');
})