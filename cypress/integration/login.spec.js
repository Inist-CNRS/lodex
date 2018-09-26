import { logout, login } from '../support/authentication';

describe('Login', () => {
    beforeEach(logout);

    it('should successfuly login as an admin', () => {
        login();
        cy.contains('No dataset').should('be.visible');
    });
});
