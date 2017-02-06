import { By } from 'selenium-webdriver';
import expect from 'expect';
import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';

describe('Home page with published data', function homePublishedDataTests() {
    this.timeout(15000);

    before(async () => {
        await clear(); // Had to ensure clear state for unknown reason
        await loadFixtures(fixtures);
        await driver.get('http://localhost:3010/');
    });

    it('should display the dataset characteristics', async () => {
        const datasetCharacteristics = await driver.findElements(By.css('.dataset-characteristic'));
        expect(datasetCharacteristics.length).toEqual(2);
        expect(datasetCharacteristics.length).toEqual(2);

        const movieLabel = await driver.findElement(By.css('.dataset-characteristic:first-child dt'));
        expect(await movieLabel.getText()).toEqual('movie');

        const movieValue = await driver.findElement(By.css('.dataset-characteristic:first-child dd'));
        expect(await movieValue.getText()).toEqual('LOTR');

        const authorLabel = await driver.findElement(By.css('.dataset-characteristic:last-child dt'));
        expect(await authorLabel.getText()).toEqual('author');

        const authorValue = await driver.findElement(By.css('.dataset-characteristic:last-child dd'));
        expect(await authorValue.getText()).toEqual('Peter Jackson');
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
