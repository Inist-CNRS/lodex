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
            annotation.createTitleAnnotation({
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
                    '',
                    '',
                    'To Review',
                    '',
                    '',
                    'John Doe',
                    'This is a comment',
                    new Date().toLocaleDateString(),
                    new Date().toLocaleDateString(),
                ]);
            });
        });
    });

    describe('resources', () => {
        describe('create list and update an Annotation', () => {
            it('should create an annotation on resource field', () => {
                cy.findByText('Search').click();
                searchDrawer.search('Terminator 2');
                searchDrawer.waitForLoading();
                cy.findByTitle('Terminator 2').click();
                annotation.createTitleAnnotation({
                    fieldLabel: 'actors',
                    comment: 'This is a comment',
                    authorName: 'John Doe',
                    authorEmail: 'john.doe@example.org',
                });

                cy.findByText('Search').click();
                searchDrawer.search('RoboCop');
                searchDrawer.waitForLoading();
                cy.findByTitle('RoboCop').click();
                annotation.createTitleAnnotation({
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
                        'Initial value',
                        'Status',
                        'Internal Comment',
                        'Administrator',
                        'Contributor',
                        'Comment',
                        'Submission date',
                        'Last modified on',
                    ]);
                });

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[0].textContent;
                    const secondUri = cells[14].textContent;

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
                        '',
                        '',
                        'To Review',
                        '',
                        '',
                        'Jane Smith',
                        'This is another comment',
                        new Date().toLocaleDateString(),
                        new Date().toLocaleDateString(),
                        secondUri,
                        'Terminator 2',
                        'actors',
                        '[K8Lu]',
                        '',
                        '',
                        '',
                        'To Review',
                        '',
                        '',
                        'John Doe',
                        'This is a comment',
                        new Date().toLocaleDateString(),
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

                cy.findByLabelText('Name').should('have.text', 'Jane Smith');

                cy.findByLabelText('Email').should(
                    'have.text',
                    'jane.smith@example.org',
                );

                cy.findByLabelText('Submission date').should(
                    'have.text',
                    new Date().toLocaleDateString(),
                );

                cy.findByLabelText('Status').should('have.text', 'To Review​');
                cy.findByLabelText('Status').click();
                cy.findByText('Validated').click();
                cy.findByLabelText('Internal Comment *').type('Return applied');
                cy.findByLabelText('Administrator').type('John Doe');
                cy.findByText('Save').click();
                cy.findByText('The suggestion has been updated.').should(
                    'exist',
                );

                cy.findByText('Annotations').click();

                cy.wait(1000);
                cy.findByRole('progressbar').should('not.exist');

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[0].textContent;
                    const secondUri = cells[14].textContent;

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
                        '',
                        '',
                        'Validated',
                        'Return applied',
                        'John Doe',
                        'Jane Smith',
                        'This is another comment',
                        new Date().toLocaleDateString(),
                        new Date().toLocaleDateString(),
                        secondUri,
                        'Terminator 2',
                        'actors',
                        '[K8Lu]',
                        '',
                        '',
                        '',
                        'To Review',
                        '',
                        '',
                        'John Doe',
                        'This is a comment',
                        new Date().toLocaleDateString(),
                        new Date().toLocaleDateString(),
                    ]);
                });
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

            annotation.createTitleAnnotation({
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
                    '',
                    '',
                    'To Review',
                    '',
                    '',
                    'John Doe',
                    'This is a comment',
                    new Date().toLocaleDateString(),
                    new Date().toLocaleDateString(),
                ]);
            });
        });
    });
});
