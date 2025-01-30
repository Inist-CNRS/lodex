import * as annotation from '../../support/annotation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as menu from '../../support/menu';
import * as searchDrawer from '../../support/searchDrawer';

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

        cy.findByRole('gridcell', { name: 'Liste des films' }).trigger(
            'mouseenter',
        );
        cy.findByRole('button', { name: 'edit-Liste des films' }).click();

        cy.findByRole('tab', { name: 'Semantics' }).click();
        cy.findByRole('checkbox', {
            name: 'This field can be annotated',
        }).click();
        cy.findByRole('button', { name: 'Save' }).click();

        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    describe('homepage', () => {
        it('should support annotations on home page', () => {
            annotation.createAnnotation({
                fieldLabel: 'Dataset Description',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@example.org',
            });

            cy.findByText('More').click();
            menu.goToAdminDashboard();
            cy.findByText('Annotations').click();

            cy.findAllByRole('cell').then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    'Home page',
                    '',
                    'Dataset Description',
                    '[Doay]',
                    '',
                    'n/a',
                    'John Doe',
                    'This is a comment',
                    new Date().toLocaleDateString(),
                ]);
            });
        });
    });

    describe('resources', () => {
        describe('createAnnotation', () => {
            it('should create an annotation on resource field', () => {
                cy.findByText('Search').click();
                searchDrawer.search('Terminator 2');
                searchDrawer.waitForLoading();
                cy.findAllByText('Terminator 2').eq(1).click();
                annotation.createAnnotation({
                    fieldLabel: 'actors',
                    comment: 'This is a comment',
                    authorName: 'John Doe',
                    authorEmail: 'john.doe@example.org',
                });

                cy.findByText('Search').click();
                searchDrawer.search('RoboCop');
                searchDrawer.waitForLoading();
                cy.findAllByText('RoboCop').eq(0).click();
                annotation.createAnnotation({
                    fieldLabel: 'rating',
                    comment: 'This is another comment',
                    authorName: 'Jane Smith',
                    authorEmail: 'jane.smith@example.org',
                });
                cy.findByText('More').click();
                menu.goToAdminDashboard();
                cy.findByText('Annotations').click();

                cy.findAllByRole('columnheader').then((headers) => {
                    expect(
                        headers.toArray().map((header) => header.textContent),
                    ).to.deep.equal([
                        'Resource URI',
                        'Resource title',
                        'Field label',
                        'Field Id',
                        'Field Icons',
                        'Field Internal Name',
                        'Contributor',
                        'Comment',
                        'Submission date',
                    ]);
                });

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[0].textContent;
                    const secondUri = cells[9].textContent;

                    expect(firstUri).to.match(/uid:\//);
                    expect(secondUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        firstUri,
                        'RoboCop',
                        'rating',
                        '[bZE+]',
                        '',
                        'n/a',
                        'Jane Smith',
                        'This is another comment',
                        new Date().toLocaleDateString(),
                        secondUri,
                        'Terminator 2',
                        'actors',
                        '[K8Lu]',
                        '',
                        'n/a',
                        'John Doe',
                        'This is a comment',
                        new Date().toLocaleDateString(),
                    ]);
                });

                cy.findByText('RoboCop').click();

                cy.findByText('Annotation: RoboCop').should('be.visible');

                cy.findByLabelText('Field Id').should('have.text', '[bZE+]');
                cy.findByLabelText('Field label').should('have.text', 'rating');
                cy.findByLabelText('Field Internal Name').should(
                    'have.text',
                    '',
                );

                cy.findByLabelText('Contributor Comment:').should(
                    'have.text',
                    'This is another comment',
                );

                cy.findByLabelText('Submission date').should(
                    'have.text',
                    new Date().toLocaleDateString(),
                );
            });

            it('should hide annotation button when field does not support annotations', () => {
                cy.findByRole('button', {
                    name: `Add an annotation to Liste des films field`,
                }).should('not.exist');
            });
        });
    });

    describe('charts', () => {
        it('should support annotations on charts', () => {
            cy.findByRole('link', { name: 'Graphs' }).click();
            cy.findByRole('link', {
                name: 'Répartition par réalisateurs uniques',
            }).click();

            annotation.createAnnotation({
                fieldLabel: 'Répartition par réalisateurs uniques',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@example.org',
            });

            cy.findByText('More').click();
            menu.goToAdminDashboard();
            cy.findByText('Annotations').click();

            cy.findAllByRole('cell').then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    'Chart page',
                    '',
                    'Répartition par réalisateurs uniques',
                    '[xkoP]',
                    '',
                    'n/a',
                    'John Doe',
                    'This is a comment',
                    new Date().toLocaleDateString(),
                ]);
            });
        });
    });
});
