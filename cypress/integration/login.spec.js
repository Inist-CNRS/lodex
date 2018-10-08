import { teardown, login } from '../support/authentication';

describe('Login', () => {
    beforeEach(() => {
        teardown(true);
    });

    it('should successfuly login as an admin', () => {
        login();
        cy.contains('No dataset').should('be.visible');
    });
});
