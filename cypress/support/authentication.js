export const login = (username = 'admin', password = 'secret') => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button').click();
    cy.location('pathname').should('equal', '/');
};

export const logout = () => {
    cy.clearCookies();
    cy.window().then(win => {
        win.sessionStorage.clear();
    });
};

export const logoutAndLoginAs = username => {
    logout();
    login(username);
};

export const teardown = (withoutLogin = false) => {
    cy.request('DELETE', '/tests/fixtures');

    if (withoutLogin) {
        logout();
        return;
    }

    logoutAndLoginAs('admin');
};
