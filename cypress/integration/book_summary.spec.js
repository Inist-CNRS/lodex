import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as menu from '../support/menu';
import * as bookSummary from '../support/bookSummary';
import * as searchDrawer from '../support/searchDrawer';

describe('Book Summary Format', () => {
    beforeEach(() => {
        cy.setCookie('lodex_tenant', 'lodex_test_book');
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/book.csv');
        datasetImportPage.importModel('model/book.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    describe('On Resource Page', () => {
        const resourceTitle = 'MP. Molecular pathology';

        beforeEach(() => {
            menu.openSearchDrawer();
            searchDrawer.search(resourceTitle);
            searchDrawer.findSearchResultByTitle(resourceTitle).click();
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

        it('should allow to embed the summary into an external website', () => {
            bookSummary.openEmbedDialog();
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
