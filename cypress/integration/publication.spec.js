import { logoutAndLogin } from '../support/authentication';
import { goToAdminDashboard } from '../support/admin';
import * as importDatasetPage from '../support/importDatasetPage';

describe('Publication', () => {
    beforeEach(logoutAndLogin);

    describe('Dataset Import', () => {
        it('should receive a csv file and preview its data in a table', () => {
            goToAdminDashboard();
            importDatasetPage.openImportModal();
            importDatasetPage.fillDatasetFileInput();

            cy
                .get('tbody')
                .should(
                    'have.text',
                    ['Row 1', 'Test 1', 'Row 2', 'Test 2'].join(''),
                );
        });
    });
});
