import * as path from 'path';

import * as annotation from '../../support/annotation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as menu from '../../support/menu';
import * as searchDrawer from '../../support/searchDrawer';

function loadFilmDataset() {
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
}

describe('Annotation', () => {
    describe('homepage', () => {
        beforeEach(loadFilmDataset);

        it('should support annotations on field on home page', () => {
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
                    'comment',
                    'Dataset Description',
                    '[Doay]',
                    '',
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
        beforeEach(loadFilmDataset);
        describe('create list and update an Annotation', () => {
            it('should create annotation on resource field', () => {
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
                annotation.createSingleValueAnnotation({
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
                        'Type',
                        'Field label',
                        'Field Id',
                        'Field Icons',
                        'Field Internal Name',
                        'Initial value',
                        'Proposed value',
                        'Status',
                        'Internal Comment',
                        'Administrator',
                        'Contributor',
                        'Contributor Comment',
                        'Submission date',
                        'Last modified on',
                    ]);
                });

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[0].textContent;
                    const secondUri = cells[16].textContent;

                    expect(firstUri).to.match(/uid:\//);
                    expect(secondUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        firstUri,
                        'RoboCop',
                        'removal',
                        'rating',
                        '[bZE+]',
                        '',
                        '',
                        '7,5',
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
                        'comment',
                        'actors',
                        '[K8Lu]',
                        '',
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

                cy.findByRole('heading', {
                    name: /^Removal: uid:\//,
                }).should('be.visible');
                cy.findByRole('heading', {
                    name: 'RoboCop',
                }).should('be.visible');

                cy.findByRole('region', { name: 'Contributor Comment' }).should(
                    'have.text',
                    'Contributor CommentThis is another comment',
                );

                cy.findByRole('region', {
                    name: 'Contributor',
                    exact: true,
                }).should(
                    'have.text',
                    'ContributorJane Smithjane.smith@example.org',
                );

                cy.findByRole('region', {
                    name: 'Contributor',
                    exact: true,
                }).then((region) => {
                    cy.findByRole('link', {
                        name: 'jane.smith@example.org',
                        container: region,
                    }).should(
                        'have.attr',
                        'href',
                        'mailto:jane.smith@example.org',
                    );
                });

                cy.findByLabelText('Submission date').should(
                    'have.text',
                    new Date().toLocaleDateString(),
                );

                cy.findByLabelText('Last modified on').should(
                    'have.text',
                    new Date().toLocaleDateString(),
                );

                cy.findByLabelText('Status').should('have.text', 'To Review');
                cy.findByLabelText('Status').click();
                cy.findByText('Validated').click();
                cy.findByLabelText('Internal Comment *').type('Return applied');
                cy.findByLabelText('Administrator').type('John Doe');
                cy.findByText('Save').click();
                cy.findByText('The suggestion has been updated.').should(
                    'exist',
                );

                cy.findByRole('link', {
                    name: 'Cancel',
                }).click();

                cy.wait(1000);
                cy.findByRole('progressbar').should('not.exist');

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[0].textContent;
                    const secondUri = cells[16].textContent;

                    expect(firstUri).to.match(/uid:\//);
                    expect(secondUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        firstUri,
                        'RoboCop',
                        'removal',
                        'rating',
                        '[bZE+]',
                        '',
                        '',
                        '7,5',
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
                        'comment',
                        'actors',
                        '[K8Lu]',
                        '',
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
                    name: `Add an annotation to Liste des films`,
                }).should('not.exist');
            });

            it('should delete an annotation on resource field', () => {
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

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[0].textContent;
                    const secondUri = cells[16].textContent;

                    expect(firstUri).to.match(/uid:\//);
                    expect(secondUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        firstUri,
                        'RoboCop',
                        'comment',
                        'rating',
                        '[bZE+]',
                        '',
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
                        'comment',
                        'actors',
                        '[K8Lu]',
                        '',
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

                cy.findByText('Terminator 2').click();

                cy.findByRole('heading', {
                    name: /^Comment: uid:\//,
                }).should('be.visible');
                cy.findByRole('heading', {
                    name: 'Terminator 2',
                }).should('be.visible');

                cy.findByRole('button', {
                    name: 'Delete the annotation',
                }).click();

                cy.findByRole('button', {
                    name: 'Delete',
                }).click();

                cy.findByRole('alert', {}).should(
                    'have.text',
                    'The annotation has been deleted.',
                );

                cy.wait(500);

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[0].textContent;

                    expect(firstUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        firstUri,
                        'RoboCop',
                        'comment',
                        'rating',
                        '[bZE+]',
                        '',
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
                    ]);
                });
            });
        });
    });

    describe('charts', () => {
        beforeEach(loadFilmDataset);

        it('should support annotations on charts', () => {
            cy.findByRole('link', { name: 'Graphs' }).click();
            cy.findByRole('link', {
                name: 'Répartition par réalisateurs uniques',
            }).click();

            annotation.createAnnotationOnFieldWithNoValue({
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
                    'comment',
                    'Répartition par réalisateurs uniques',
                    '[xkoP]',
                    '',
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

    describe('export', () => {
        beforeEach(loadFilmDataset);

        it('should export annotations', () => {
            annotation.createTitleAnnotation({
                fieldLabel: 'Dataset Description',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@example.org',
            });

            cy.findByText('More').click();
            menu.goToAdminDashboard();
            cy.findByText('Annotations').click();

            cy.findByLabelText('Open menu').click();

            cy.findByRole('menuitem', { name: /Annotations/ })
                .should('exist')
                .trigger('mouseover');

            cy.findAllByRole('menuitem', {
                name: 'Export the annotations',
            })
                .should('exist')
                .click();

            cy.wait(1000);

            const downloadsFolder = Cypress.config('downloadsFolder');

            cy.task('getFiles', downloadsFolder).then((downloadedFiles) => {
                const downloadedAnnotations = downloadedFiles.filter((name) =>
                    name.match(/annotations_\d{4}-\d{2}-\d{2}-\d{6}.json/),
                );

                expect(downloadedAnnotations).to.have.length(1);

                const [annotationExport] = downloadedAnnotations;

                const filePath = path.join(downloadsFolder, annotationExport);

                cy.readFile(filePath)
                    .should('exist')
                    .then((content) => {
                        expect(content.at(0)).to.include({
                            resourceUri: null,
                            target: 'title',
                            kind: 'comment',
                            itemPath: null,
                            comment: 'This is a comment',
                            authorName: 'John Doe',
                            authorEmail: 'john.doe@example.org',
                            initialValue: null,
                            status: 'to_review',
                            internalComment: null,
                        });
                    });

                cy.task('removeFile', filePath);
            });
        });
    });
});
