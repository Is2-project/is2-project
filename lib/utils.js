const uuid = require('uuid');
const md5 = require('md5');

/* Pepper used for securing passwords in the database */
const pepper = "SALTY_PEPPER";

/**
 *  Checks if the string provided respects RFC822 standard
 *  @param {string} email   The email to be checked
 *  @returns {boolean}      True if the email is valid
*/
function validateEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

/**
 *  Generates a cryptographically secure random salt string
 *  @returns {string}      The cryptographically secure random salt string
*/
function generateSalt() {
    return uuid.v4().substr(0, 8);
}

/**
 *  Hashes the password with salt (provided) and pepper (fixed) (md5)
 *  @param {string} password   The user's password
 *  @param {string} salt       The random salt to be applied
 *  @returns {string}          The hashed password
*/
function hashPassword(password, salt) {
    return md5(salt + password + pepper);
}

module.exports = {
    validateEmail,
    generateSalt,
    hashPassword
}