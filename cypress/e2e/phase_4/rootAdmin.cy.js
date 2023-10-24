describe('RootAdmin', () => {
    it('should add an advanced enrichment', () => {
        cy.request('DELETE', '/tests/fixtures');

        // Should display an 404 error if we go on an non existing instance
        cy.visit('http://localhost:3000/instance/tenant-1/');
        cy.contains('404');

        // Create a new instance
        cy.visit('http://localhost:3000/instances');

        // log in as admin
        cy.get('input[name="username"]').type('root');
        cy.get('input[name="password"]').type('secret');
        cy.get('button[type="submit"').click();

        // Create a new instance
        // Find button ajouter
        cy.get('button')
            .contains('Ajouter')
            .click();
        // Fill the form
        cy.get('input[id="tenant-name-field"]').type('tenant-1');
        cy.get('input[id="tenant-description-field"]').type('Description');
        cy.get('input[id="tenant-author-field"]').type('Author');
        cy.get('button')
            .contains('Créer')
            .click();

        // Should display the new instance with login form
        cy.visit('http://localhost:3000/instance/tenant-1/');
        cy.contains('Username');
        cy.contains('Password');
    });
});
