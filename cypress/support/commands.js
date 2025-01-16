import '@testing-library/cypress/add-commands';
import jwt from 'jsonwebtoken';

Cypress.Commands.add('jwtSign', (payload, secretKey) =>
    jwt.sign(payload, secretKey),
);
