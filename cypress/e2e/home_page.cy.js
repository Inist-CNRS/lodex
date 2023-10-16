import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as menu from '../support/menu';
import * as graphPage from '../support/graphPage';
import * as homePage from '../support/homePage';

describe('Home Page', () => {
    beforeEach(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();

        datasetImportPage.importDataset('dataset/film.csv');
        datasetImportPage.importModel('model/film.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    // @todo: Fix it after mid-sprint presentation
    it.skip('should not use the facets to filter the home page formats', () => {
        menu.openChartDrawer();
        menu.goToChart('Répartition par réalisateurs');

        graphPage.getStats().should('have.text', 'Found 30 on 30');
        graphPage.searchFor('Lucas');
        graphPage.getStats().should('have.text', 'Found 4 on 30');

        menu.goToHomePage();
        homePage.checkCharacteristicsOrder([
            'Dataset Name',
            'Dataset Description',
            'Nombre de films',
            'Liste des films',
            //TODO  with Graph Links 'Répartition par réalisateurs',
        ]);
        homePage.checkCharacteristic('mzm2', '30');
    });
});
