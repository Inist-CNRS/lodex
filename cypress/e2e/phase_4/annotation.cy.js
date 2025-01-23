import * as annotation from '../../support/annotation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as menu from '../../support/menu';

describe('Annotation', () => {
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

        cy.findByRole('gridcell', { name: 'Liste des films' }).trigger(
            'mouseenter',
        );
        cy.findByRole('button', { name: 'edit-Liste des films' }).click();

        cy.findByRole('tab', { name: 'Semantics' }).click();
        cy.findByRole('checkbox', {
            name: 'This field can be annotated',
        }).click();
        cy.findByRole('button', { name: 'Save' }).click();

        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    describe('createAnnotation', () => {
        it('should create an annotation', () => {
            annotation.createAnnotation({
                fieldLabel: 'Nombre de films',
                comment: 'This is a comment',
            });
        });

        it('should hide annotation button when field does not support annotations', () => {
            cy.findByRole('button', {
                name: `Add an annotation to Liste des films field`,
            }).should('not.exist');
        });
    });
});
