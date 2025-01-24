import * as annotation from '../../support/annotation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as searchDrawer from '../../support/searchDrawer';
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
        it('should create an annotation on resource field', () => {
            cy.findByText('Search').click();
            searchDrawer.search('Terminator 2');
            searchDrawer.waitForLoading();
            cy.findAllByText('Terminator 2').eq(1).click();
            annotation.createAnnotation({
                fieldLabel: 'actors',
                comment: 'This is a comment',
            });
            cy.findByText('Search').click();
            searchDrawer.search('RoboCop');
            searchDrawer.waitForLoading();
            cy.findAllByText('RoboCop').eq(0).click();
            annotation.createAnnotation({
                fieldLabel: 'rating',
                comment: 'This is another comment',
            });
            cy.findByText('More').click();
            menu.goToAdminDashboard();
            cy.findByText('Annotations').click();

            cy.findAllByRole('columnheader').then((headers) => {
                expect(
                    headers.toArray().map((header) => header.textContent),
                ).to.deep.equal([
                    'Comment',
                    'Resource title',
                    'Submission date',
                ]);
            });

            cy.findAllByRole('cell').then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    'This is another comment',
                    'RoboCop',
                    '1/24/2025',
                    'This is a comment',
                    'Terminator 2',
                    '1/24/2025',
                ]);
            });
        });

        it('should hide annotation button when field does not support annotations', () => {
            cy.findByRole('button', {
                name: `Add an annotation to Liste des films field`,
            }).should('not.exist');
        });
    });
});
