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
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    describe('createAnnotation', () => {
        it('should create an annotation', () => {
            annotation.createAnnotation({
                fieldLabel: 'Dataset Name',
                comment: 'This is a comment',
            });
        });
    });
});
