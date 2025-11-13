describe('RootAdmin', () => {
    beforeEach(() => {
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

        cy.waitForNetworkIdle(500);
    });
    it('should add a tenant', () => {
        // Create a new instance
        // Find button ajouter
        cy.get('button').contains('Ajouter').click();
        // Fill the form
        cy.get('input[id="tenant-name-field"]').type('tenant-1');
        cy.get('input[id="tenant-description-field"]').type('Description');
        cy.get('input[id="tenant-author-field"]').type('Author');
        cy.get('button').contains('Créer').click();

        cy.findByText('Instance créée');

        // Should display the new instance with login form
        cy.visit('http://localhost:3000/instance/tenant-1/');
        cy.contains('Username');
        cy.contains('Password');
    });

    it('should allow to update a tenant', () => {
        // Create a new instance
        // Find button ajouter
        cy.get('button').contains('Ajouter').click();
        // Fill the form
        cy.get('input[id="tenant-name-field"]').type('tenant-1');
        cy.get('input[id="tenant-description-field"]').type('Description');
        cy.get('input[id="tenant-author-field"]').type('Author');
        cy.get('button').contains('Créer').click();

        cy.findByText('Instance créée');

        cy.visit('http://localhost:3000/instance/tenant-1/');
        cy.findByLabelText('Username *').type('admin');
        cy.findByLabelText('Password *').type('secret');
        cy.findByRole('button', { name: 'Sign in' }).click();

        cy.waitForNetworkIdle(500);

        cy.contains('No data published');

        cy.findByText('More').click();
        cy.findByText('Sign out').click();

        cy.visit('http://localhost:3000/instances');
        cy.waitForNetworkIdle(500);

        // Find edit button
        cy.findByTitle('Editer tenant-1').click();

        // Update the form
        cy.findByLabelText('Description').clear().type('New Description');
        cy.findByLabelText('Auteur').clear().type('New Author');
        cy.findByLabelText('Username *').clear().type('new-username');
        cy.findByLabelText('Password *').clear().type('new-password');
        cy.get('button').contains('Modifier').click();

        cy.findByText('Instance modifiée');

        cy.visit('http://localhost:3000/instance/tenant-1/');
        cy.findByLabelText('Username *').type('admin');
        cy.findByLabelText('Password *').type('secret');
        cy.findByRole('button', { name: 'Sign in' }).click();
        cy.findByText('Username and password are unknown.').should(
            'be.visible',
        );

        cy.visit('http://localhost:3000/instance/tenant-1/');
        cy.findByLabelText('Username *').type('new-username');
        cy.findByLabelText('Password *').type('new-password');
        cy.findByRole('button', { name: 'Sign in' }).click();

        cy.waitForNetworkIdle(500);

        cy.contains('No data published');
    });

    it('should allow to delete a tenant', () => {
        // Create a new instance
        // Find button ajouter
        cy.get('button').contains('Ajouter').click();
        // Fill the form
        cy.get('input[id="tenant-name-field"]').type('tenant-1');
        cy.get('input[id="tenant-description-field"]').type('Description');
        cy.get('input[id="tenant-author-field"]').type('Author');
        cy.get('button').contains('Créer').click();

        cy.findByText('Instance créée');

        cy.findByTestId('DeleteIcon').click();

        cy.findByRole('dialog').within(() => {
            cy.findByText('tenant-1').should('be.visible');

            // cy.findByText('Supprimer').click();
            cy.findByText('Supprimer').should('be.disabled');
            cy.findByLabelText(
                "Taper le nom de l'instance pour confirmer la suppression",
                {
                    exact: false,
                },
            ).type('tenant-1');
            cy.findByText('Supprimer').should('not.be.disabled');
            cy.findByText('Supprimer').click();
        });

        cy.findByText('Instance supprimée');

        cy.visit('http://localhost:3000/instance/tenant-1/');
        cy.contains('404');
    });
});
