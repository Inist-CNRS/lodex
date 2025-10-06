import { ADMIN_ROLE, DEFAULT_TENANT } from '../../src/common/tools/tenantTools';

export const login = (username = 'admin', password = 'secret') => {
    cy.visit('http://localhost:3000');
    cy.findByLabelText('Username *').type(username);
    cy.findByLabelText('Password *').type(password);
    cy.get('button').click();
    cy.location('pathname').should('equal', `/instance/${DEFAULT_TENANT}/`);
};

export const logout = () => {
    cy.clearCookies();
    cy.window().then((win) => {
        win.sessionStorage.clear();
        win.localStorage.clear();
    });
};

export const logoutAndLoginAs = (username) => {
    logout();
    login(username);
};

export const teardown = (withoutLogin: boolean = false) => {
    cy.request('DELETE', '/tests/fixtures');

    if (withoutLogin) {
        logout();
        return;
    }

    cy.window().then((win) => {
        win.sessionStorage.setItem('tenant', DEFAULT_TENANT);
    });

    logoutAndLoginAs(ADMIN_ROLE);
};
