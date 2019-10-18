import { teardown } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import * as searchDrawer from '../support/searchDrawer';
import * as resourcePage from '../support/resourcePage';

describe('Resource', () => {
    const dataset = 'dataset/book_summary.csv';
    const model = 'model/book_summary.json';

    describe('Create a resource', () => {
        before(() => {
            teardown();
            homePage.openAdvancedDrawer();
            homePage.goToAdminDashboard();

            datasetImportPage.importDataset(dataset);
            datasetImportPage.importModel(model);
            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
        });

        it('should create a resource', () => {
            resourcePage.openCreateResourceForm();

            resourcePage.fillResourceFormInput('XXRn', 'Salut'); // Title
            resourcePage.fillResourceFormInput('j7uI', 'https://marmelab.com'); // URL
            resourcePage.fillResourceFormInput('khbR', 'SLT'); // ISSN
            resourcePage.fillResourceFormInput('Rijz', '2019'); // Première mise en ligne en

            resourcePage.saveResourceForm();

            searchDrawer.openSearchDrawer();
            searchDrawer.search('Salut');

            searchDrawer.findSearchResultByTitle('Salut').click();

            resourcePage.checkResourceField('XXRn', 'Salut');
            resourcePage.checkResourceField('j7uI', 'https://marmelab.com');
            resourcePage.checkResourceField('khbR', 'SLT');
            resourcePage.checkResourceField('Rijz', '2019');
        });
    });
});
