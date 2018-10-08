import { logoutAndLogin } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as homePage from '../support/homePage';
import * as graphPage from '../support/graphPage';

describe('Model Page', () => {
    beforeEach(() => {
        logoutAndLogin();
        homePage.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/book.csv');
        datasetImportPage.importModel('model/book.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
        homePage.goToGraphPage();
        graphPage.goToResourceNumber(1);
    });

    it('should display list of year', () => {

    });
});
