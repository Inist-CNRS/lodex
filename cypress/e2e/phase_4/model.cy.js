import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as menu from '../../support/menu';
import * as homePage from '../../support/homePage';
import * as searchDrawer from '../../support/searchDrawer';

describe('Model Page', () => {
    describe('handling old models', () => {
        beforeEach(() => {
            // ResizeObserver doesn't like when the app has to many renders / re-renders
            // and throws an exception to say, "I wait for the next paint"
            // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
            cy.on('uncaught:exception', (error) => {
                return !error.message.includes('ResizeObserver');
            });

            teardown();
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/film.csv');
            datasetImportPage.importModel('model/film-obsolete.json');
            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
        });

        it('should display list of fields in home', () => {
            homePage.checkCharacteristicsOrder([
                'Dataset Name',
                'Dataset Description',
                'Nombre de films',
                'Liste des films',
                'Répartition par créateurs',
            ]);

            cy.get('.property_label').contains('rating').should('not.exist');
        });

        it('should display list of fields in resources', () => {
            menu.openSearchDrawer();
            searchDrawer.search('Star Wars Episode IV: A New Hope');
            searchDrawer
                .findSearchResultByTitle('Star Wars Episode IV: A New Hope')
                .click();

            cy.get('.property_label').contains('actors').should('be.visible');

            cy.get('.property_value')
                .contains('Mark Hamill')
                .should('be.visible');

            cy.get('.property_label').contains('rating').should('be.visible');

            cy.get('.property_value').contains('8,7').should('be.visible');

            cy.get('.property_label')
                .contains('Répartition par créateurs')
                .should('not.exist');

            cy.get('.property_label')
                .contains('Répartition par réalisateurs uniques')
                .should('not.exist');
        });

        it('should display list of fields in graphics', () => {
            menu.openChartDrawer();

            cy.get('.graph-summary-label')
                .contains('Répartition par créateurs')
                .should('be.visible');

            cy.get('.graph-summary-label')
                .contains('Répartition par réalisateurs uniques')
                .should('be.visible');

            menu.goToChart('Répartition par créateurs');
        });
    });
});
