import { teardown, login } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as loginPage from '../support/loginPage';
import * as menu from '../support/menu';

describe('Login', () => {
    beforeEach(() => {
        teardown(true);
    });

    it('should successfully login as an admin', () => {
        login();
        cy.contains('No data has been published yet').should('be.visible');
    });

    it('should successfully sign out and go to login page', () => {
        login();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();

        datasetImportPage.importDataset('dataset/chart.csv');
        datasetImportPage.importModel('model/chart.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();

        menu.openAdvancedDrawer();
        menu.signOut();

        cy.visit('http://localhost:3000');
        cy.wait(300);
        menu.openAdvancedDrawer();
        menu.openChartDrawer();
        menu.clickOnChart('Pie Chart');

        loginPage.checkLoginPage();
    });
});
