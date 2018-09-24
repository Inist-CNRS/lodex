import { logout } from '../support/authentication';

describe('Login', () => {
    beforeEach(logout);

    it('should successfuly login as an admin', () => {
        cy.visit('http://localhost:3000');

        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('secret');
        cy.get('button').click();

        cy.location('pathname').should('equal', '/');
    });
});
