import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as homePage from '../support/homePage';
import * as graphPage from '../support/graphPage';
import * as bookSummary from '../support/bookSummary';

describe('Book Summary Format', () => {
    beforeEach(() => {
        teardown();
        homePage.openAdvancedDrawer();
        homePage.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/book.csv');
        datasetImportPage.importModel('model/book.json');
        datasetImportPage.publish();
    });

    describe('On Resource Page', () => {
        beforeEach(() => {
            homePage.goToGraphPage();
            graphPage.goToResourceNumber(1);
        });

        it('should display list of year', () => {
            bookSummary.checkYears([2003, 2002, 2001, 2000, 1999, 1998, 1997]);
            bookSummary.openFold(1998);
            bookSummary.checkVolumes(1998, [52]);
            bookSummary.openFold('Volume: 52');
            bookSummary.checkIssues(1998, 52, [1, 2, 3, 4, 5, 6]);

            bookSummary.openFold('Issue: 3');
            bookSummary.checkDocuments(1998, 52, 3, [
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
            bookSummary.loadMore();
            bookSummary.checkDocuments(1998, 52, 3, [
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
            bookSummary.checkYears([2003, 2002, 2001, 2000, 1999, 1998, 1997]);
            bookSummary.openConfigure();
            bookSummary.configureYearSort('From oldest to youngest');
            bookSummary.saveConfiguration();
            bookSummary.checkYears([1997, 1998, 1999, 2000, 2001, 2002, 2003]);
            bookSummary.openConfigure();
            bookSummary.configureYearThreshold(5);
            bookSummary.saveConfiguration();
            bookSummary.checkYears(['1997-1999', '2000-2003']);
            bookSummary.openConfigure();
            bookSummary.configureYearSort('From youngest to oldest');
            bookSummary.saveConfiguration();
            bookSummary.checkYears(['2000-2003', '1997-1999']);
        });

        it('should allow to embed the summary into an external website', () => {
            bookSummary.openEmbedModal();

            cy.contains('embedded-istex-summary').should('exist');
        });
    });

    describe('On Embedded Page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/tests/external/index.html');
        });

        it('should display list of year', () => {
            bookSummary.checkYears([2003, 2002, 2001, 2000, 1999, 1998, 1997]);
            bookSummary.openFold(1998);
            bookSummary.checkVolumes(1998, [52]);
            bookSummary.openFold('Volume: 52');
            bookSummary.checkIssues(1998, 52, [1, 2, 3, 4, 5, 6]);

            bookSummary.openFold('Issue: 3');
            bookSummary.checkDocuments(1998, 52, 3, [
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
            bookSummary.loadMore();
            bookSummary.checkDocuments(1998, 52, 3, [
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
    });
});
