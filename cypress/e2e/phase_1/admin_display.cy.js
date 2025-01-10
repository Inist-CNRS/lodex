import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as fields from '../../support/fields';
import * as menu from '../../support/menu';

describe('Home Page', () => {
    beforeEach(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();

        datasetImportPage.importDataset('dataset/film.csv');
    });

    it('should automatically bind home page field icon', () => {
        cy.findByRole('link', {
            name: /Display/,
        }).click();

        fields.createNewField();

        cy.findByRole('gridcell', {
            name: /newField/,
            timeout: 1000,
        })
            .should('be.visible')
            .then((parent) => {
                cy.findByTestId('HomeIcon', {
                    container: parent,
                    timeout: 500,
                }).should('be.visible');
            });
    });

    it('should automatically bind main resource page field icon', () => {
        cy.findByRole('link', {
            name: /Display/,
            timeout: 1000,
        }).click();

        cy.findByRole('menuitem', {
            name: /Main resource/,
            timeout: 1000,
        }).click();

        fields.createNewField();

        cy.findByRole('gridcell', {
            name: /newField/,
            timeout: 1000,
        })
            .should('be.visible')
            .then((parent) => {
                cy.findByTestId('ArticleIcon', {
                    container: parent,
                    timeout: 500,
                }).should('be.visible');
            });
    });
});
