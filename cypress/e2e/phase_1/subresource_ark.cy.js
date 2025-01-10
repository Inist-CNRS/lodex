import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as menu from '../../support/menu';

describe('Ark subresource', () => {
    beforeEach(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/subresources-ark-data.json');
        datasetImportPage.importModel('model/subresources-ark-model.tar');
    });

    it('should display a back button when going to subresource', () => {
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();

        cy.findByRole('link', {
            name: /Search/,
            timeout: 500,
        })
            .should('be.visible')
            .click();

        cy.findByText('Publication n°1', {
            timeout: 500,
        })
            .should('be.visible')
            .click();

        cy.findByText('Publication n°1', {
            timeout: 500,
        })
            .should('be.visible')
            .click();

        cy.findByRole('link', {
            name: 'uid:/2acebfc7a1e13123df28821e41424d80',
            timeout: 500,
        }).click();

        cy.findByText('Canidae', {
            timeout: 500,
        }).should('be.visible');

        cy.findByRole('button', {
            name: 'Go back to resource',
            timeout: 500,
        })
            .should('be.visible')
            .click();

        cy.findByRole('link', {
            name: 'uid:/2acebfc7a1e13123df28821e41424d80',
            timeout: 500,
        }).should('be.visible');
    });
});
