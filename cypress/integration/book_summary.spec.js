import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as homePage from '../support/homePage';
import * as graphPage from '../support/graphPage';
import * as bookSummaryPage from '../support/bookSummary';

describe('Book Summary Format', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/admin');
        teardown();
        homePage.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/book.csv');
        datasetImportPage.importModel('model/book.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
        homePage.goToGraphPage();
        graphPage.goToResourceNumber(1);
    });

    it('should display list of year', () => {
        bookSummaryPage.checkYears([2003, 2002, 2001, 2000, 1999, 1998, 1997]);
        bookSummaryPage.openFold(1998);
        bookSummaryPage.checkVolumes(1998, [52]);
        bookSummaryPage.openFold('Volume: 52');
        bookSummaryPage.checkIssues(1998, 52, [1, 2, 3, 4, 5, 6]);

        bookSummaryPage.openFold('Issue: 3');
        bookSummaryPage.checkDocuments(1998, 52, 3, [
            'Cytochrome P450 CYP 1B1 mRNA in normal human brain.',
            'Absence of prolactin gene expression in colorectal cancer.',
            'Association of p53 genomic instability with the glutathione S-transferase null genotype in gastric cancer in the Portuguese population.',
            'Demystified ... DNA nucleotide sequencing.',
            'A simple method for PCR based analyses of immunohistochemically stained, microdissected, formalin fixed, paraffin wax embedded material.',
            'Proteolysis in colorectal cancer.',
            'Alterations in cadherin and catenin expression during the biological progression of melanocytic tumours.',
            'Use of magnetic beads for tissue DNA extraction and IS6110 Mycobacterium tuberculosis PCR.',
            'Molecular detection of c-mpl thrombopoietin receptor gene expression in chronic myeloproliferative disorders.',
            'Demystified ... gene knockouts.',
        ]);
        bookSummaryPage.loadMore();
        bookSummaryPage.checkDocuments(1998, 52, 3, [
            'Cytochrome P450 CYP 1B1 mRNA in normal human brain.',
            'Absence of prolactin gene expression in colorectal cancer.',
            'Association of p53 genomic instability with the glutathione S-transferase null genotype in gastric cancer in the Portuguese population.',
            'Demystified ... DNA nucleotide sequencing.',
            'A simple method for PCR based analyses of immunohistochemically stained, microdissected, formalin fixed, paraffin wax embedded material.',
            'Proteolysis in colorectal cancer.',
            'Alterations in cadherin and catenin expression during the biological progression of melanocytic tumours.',
            'Use of magnetic beads for tissue DNA extraction and IS6110 Mycobacterium tuberculosis PCR.',
            'Molecular detection of c-mpl thrombopoietin receptor gene expression in chronic myeloproliferative disorders.',
            'Demystified ... gene knockouts.',
            'DNA repair gene status in oesophageal cancer.',
        ]);
    });

    it('should allow to configure format', () => {
        bookSummaryPage.checkYears([2003, 2002, 2001, 2000, 1999, 1998, 1997]);
        bookSummaryPage.openConfigure();
        bookSummaryPage.configureYearSort('From oldest to youngest');
        bookSummaryPage.saveConfiguration();
        bookSummaryPage.checkYears([1997, 1998, 1999, 2000, 2001, 2002, 2003]);
        bookSummaryPage.openConfigure();
        bookSummaryPage.configureYearThreshold(5);
        bookSummaryPage.saveConfiguration();
        bookSummaryPage.checkYears(['1997-1999', '2000-2003']);
        bookSummaryPage.openConfigure();
        bookSummaryPage.configureYearSort('From youngest to oldest');
        bookSummaryPage.saveConfiguration();
        bookSummaryPage.checkYears(['2000-2003', '1997-1999']);
    });
});
