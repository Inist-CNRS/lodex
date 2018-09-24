export const login = (username = 'admin', password = 'secret') => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button').click();
    cy.location('pathname').should('equal', '/');
};

export const logout = () => {
    cy.request('DELETE', '/tests/fixtures');
};

export const logoutAndLogin = () => {
    logout();
    login();
};
