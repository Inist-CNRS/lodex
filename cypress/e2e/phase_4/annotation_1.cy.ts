import * as annotation from '../../support/annotation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import { fillInputWithFixture } from '../../support/forms';
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

    cy.findByRole('tab', { name: 'Annotations' }).click();
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

            annotation.checkFieldAnnotations({
                fieldLabel: 'Dataset Description',
                expectedAnnotations: [
                    {
                        kind: 'comment',
                        summaryValue: 'This is a comment',
                        status: 'Ongoing',
                    },
                ],
                resourceTitle: 'Home page',
            });
            cy.findByText('More').click();
            menu.goToAdminDashboard();
            cy.findByText('Annotations').click();

            cy.findAllByRole('cell').then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    '',
                    '/',
                    '',
                    'Comment',
                    'Dataset Description',
                    '',
                    '',
                    '',
                    'John Doe',
                    'To Review',
                    '',
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
                annotation.checkFieldAnnotations({
                    fieldLabel: 'actors',
                    expectedAnnotations: [
                        {
                            kind: 'comment',
                            summaryValue: 'This is a comment',
                            status: 'Ongoing',
                        },
                    ],
                    resourceTitle: 'Terminator 2',
                });

                cy.findByText('Search').click();

                searchDrawer.filterShowResourcesIAnnotated();
                searchDrawer.checkResultsCount(1);
                searchDrawer.checkResultList(['Terminator 2']);

                searchDrawer.filterShowResourcesIHaveNotAnnotated();
                searchDrawer.search('RoboCop');
                searchDrawer.waitForLoading();
                cy.findByTitle('RoboCop').click();
                annotation.createSingleValueAnnotation({
                    fieldLabel: 'rating',
                    comment: 'This is another comment',
                    authorName: 'Jane Smith',
                    authorEmail: 'jane.smith@example.org',
                });
                annotation.checkFieldAnnotations({
                    fieldLabel: 'rating',
                    expectedAnnotations: [
                        {
                            kind: 'removal',
                            summaryValue: '7,5',
                            status: 'Ongoing',
                        },
                    ],
                    resourceTitle: 'RoboCop',
                });

                cy.findByText('Search').click();
                searchDrawer.clearSearch();
                searchDrawer.filterShowResourcesIAnnotated();

                searchDrawer.checkResultsCount(2);
                searchDrawer.checkResultList(['RoboCop', 'Terminator 2']);

                cy.findByText('More').click();
                menu.goToAdminDashboard();
                cy.findByText('Annotations').click();

                cy.findAllByRole('columnheader').then((headers) => {
                    expect(
                        headers.toArray().map((header) => header.textContent),
                    ).to.deep.equal([
                        '',
                        'URI',
                        'Title',
                        'Type',
                        'Field label',
                        'Field Icon(s)',
                        'Initial value',
                        'Proposed values',
                        'Contributor',
                        'Status',
                        'Administrator',
                        'Submission date',
                    ]);
                });

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[1].textContent;
                    const secondUri = cells[13].textContent;

                    expect(firstUri).to.match(/uid:\//);
                    expect(secondUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        '',
                        firstUri,
                        'RoboCop',
                        'Removal',
                        'rating',
                        '',
                        '7,5',
                        '',
                        'Jane Smith',
                        'To Review',
                        '',
                        new Date().toLocaleDateString(),
                        '',
                        secondUri,
                        'Terminator 2',
                        'Comment',
                        'actors',
                        '',
                        '',
                        '',
                        'John Doe',
                        'To Review',
                        '',
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
                    // @ts-expect-error TS2353
                    exact: true,
                }).should(
                    'have.text',
                    'ContributorJane Smithjane.smith@example.org',
                );

                cy.findByRole('region', {
                    name: 'Contributor',
                    // @ts-expect-error TS2353
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

                cy.wait(1000);
                cy.findByRole('progressbar').should('not.exist');

                cy.findAllByRole('cell').then((cells) => {
                    const firstUri = cells[1].textContent;
                    const secondUri = cells[13].textContent;

                    expect(firstUri).to.match(/uid:\//);
                    expect(secondUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        '',
                        firstUri,
                        'RoboCop',
                        'Removal',
                        'rating',
                        '',
                        '7,5',
                        '',
                        'Jane Smith',
                        'Validated',
                        'John Doe',
                        new Date().toLocaleDateString(),
                        '',
                        secondUri,
                        'Terminator 2',
                        'Comment',
                        'actors',
                        '',
                        '',
                        '',
                        'John Doe',
                        'To Review',
                        '',
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
                    const firstUri = cells[1].textContent;
                    const secondUri = cells[13].textContent;

                    expect(firstUri).to.match(/uid:\//);
                    expect(secondUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        '',
                        firstUri,
                        'RoboCop',
                        'Comment',
                        'rating',
                        '',
                        '',
                        '',
                        'Jane Smith',
                        'To Review',
                        '',
                        new Date().toLocaleDateString(),
                        '',
                        secondUri,
                        'Terminator 2',
                        'Comment',
                        'actors',
                        '',
                        '',
                        '',
                        'John Doe',
                        'To Review',
                        '',
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
                    const firstUri = cells[1].textContent;

                    expect(firstUri).to.match(/uid:\//);

                    expect(
                        cells.toArray().map((cell) => cell.textContent),
                    ).to.deep.equal([
                        '',
                        firstUri,
                        'RoboCop',
                        'Comment',
                        'rating',
                        '',
                        '',
                        '',
                        'Jane Smith',
                        'To Review',
                        '',
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

            annotation.checkFieldAnnotations({
                fieldLabel: 'Répartition par réalisateurs uniques',
                expectedAnnotations: [
                    {
                        kind: 'comment',
                        summaryValue: 'This is a comment',
                        status: 'Ongoing',
                    },
                ],
                resourceTitle: 'Chart page',
            });

            cy.findByText('More').click();
            menu.goToAdminDashboard();
            cy.findByText('Annotations').click();

            cy.findAllByRole('cell').then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    '',
                    '/graph/xkoP',
                    '',
                    'Comment',
                    'Répartition par réalisateurs uniques',
                    '',
                    '',
                    '',
                    'John Doe',
                    'To Review',
                    '',
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

            cy.task('getFileContent', {
                directory: Cypress.config('downloadsFolder'),
                pattern: /annotations_\d{4}-\d{2}-\d{2}-\d{6}.json/,
            }).then((content) => {
                expect(content).not.to.equal(null);
                // @ts-expect-error TS2345
                const annotations = JSON.parse(content);
                expect(annotations).to.be.an('array').with.length(1);
                expect(annotations[0]).to.include({
                    resourceUri: '/',
                    target: 'title',
                    kind: 'comment',
                    comment: 'This is a comment',
                    authorName: 'John Doe',
                    authorEmail: 'john.doe@example.org',
                    initialValue: null,
                    status: 'to_review',
                    internalComment: null,
                });
            });
        });
    });

    describe('import', () => {
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
            datasetImportPage.importModel('model/film-with-field-id.tar');

            cy.findByRole('gridcell', { name: 'Liste des films' }).trigger(
                'mouseenter',
            );
            cy.findByRole('button', { name: 'edit-Liste des films' }).click();

            cy.findByRole('tab', { name: 'Annotations' }).click();
            cy.findByRole('checkbox', {
                name: 'This field can be annotated',
            }).click();
            cy.findByRole('button', { name: 'Save' }).click();

            datasetImportPage.publish();

            cy.findByRole('button', {
                name: 'Open menu',
            }).click();

            cy.findByRole('menuitem', {
                name: 'Model',
            }).trigger('mouseleave');

            cy.findByRole('menuitem', {
                name: 'Annotations',
            }).trigger('mouseenter');

            cy.wait(500);
        });

        it('should import annotations from an annotation export', () => {
            fillInputWithFixture(
                'input[name="import_annotations"]',
                'annotations/film-with-field-id.json',
                'application/json',
            );

            cy.findByText(
                'annotations/film-with-field-id.json file have been imported successfully.',
                {
                    timeout: 2000,
                },
            ).should('exist');

            cy.wait(1000);

            cy.findByText('Annotations').click();

            cy.findAllByRole('cell', {
                timeout: 2000,
            }).then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    '',
                    '/',
                    '',
                    'Comment',
                    'Dataset Description',
                    '',
                    '',
                    '',
                    'John Doe',
                    'To Review',
                    '',
                    new Date(2025, 1, 11).toLocaleDateString(),
                ]);
            });
        });

        it('should only imports valid annotations', () => {
            fillInputWithFixture(
                'input[name="import_annotations"]',
                'annotations/film-with-errors.json',
                'application/json',
            );

            cy.findByText(
                /1 annotation failed to be imported: annotations_import_error/,
                {
                    timeout: 2000,
                },
            ).should('exist');

            cy.wait(1000);

            cy.findByText('Annotations').click();

            cy.findAllByRole('cell', {
                timeout: 2000,
            }).then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    '',
                    '/',
                    '',
                    'Comment',
                    'Dataset Description',
                    '',
                    '',
                    '',
                    'John Doe',
                    'To Review',
                    '',
                    new Date(2025, 1, 11).toLocaleDateString(),
                ]);
            });

            cy.task('getFileContent', {
                directory: Cypress.config('downloadsFolder'),
                pattern:
                    /annotations_import_error_\d{4}-\d{2}-\d{2}-\d{6}.json/,
            }).then((content) => {
                expect(content).not.to.equal(null);

                // @ts-expect-error TS2345
                const errors = JSON.parse(content);
                expect(errors).to.be.an('array').with.length(1);
                cy.log('errors', errors);
                expect(errors[0].annotation).to.include({
                    resourceUri: '/',
                    target: 'title',
                    kind: 'unknown',
                    comment: 'This is a comment',
                    authorName: 'John Doe',
                    authorEmail: 'john.doe@example.org',
                    initialValue: null,
                    status: 'to_review',
                    internalComment: null,
                });

                expect(errors[0].errors).to.be.an('array').with.length(1);
            });
        });
    });

    describe('delete many', () => {
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
            datasetImportPage.importModel('model/film-with-field-id.tar');

            cy.findByRole('gridcell', { name: 'Liste des films' }).trigger(
                'mouseenter',
            );
            cy.findByRole('button', { name: 'edit-Liste des films' }).click();

            cy.findByRole('tab', { name: 'Annotations' }).click();
            cy.findByRole('checkbox', {
                name: 'This field can be annotated',
            }).click();
            cy.findByRole('button', { name: 'Save' }).click();

            datasetImportPage.publish();

            cy.findByRole('button', {
                name: 'Open menu',
            }).click();

            cy.findByRole('menuitem', {
                name: 'Model',
            }).trigger('mouseleave');

            cy.findByRole('menuitem', {
                name: 'Annotations',
            }).trigger('mouseenter');

            cy.wait(500);

            fillInputWithFixture(
                'input[name="import_annotations"]',
                'annotations/film-many-annotations.json',
                'application/json',
            );

            cy.wait(1000);

            cy.findByText('Annotations').click();
        });

        it('should delete many annotations', () => {
            cy.findAllByRole('checkbox').eq(1).click();
            cy.findAllByRole('checkbox').eq(2).click();

            cy.findByRole('button', {
                name: 'Delete the selected annotation(s)',
            }).click();

            cy.findByRole('button', {
                name: 'Delete',
            }).click();

            cy.wait(500);

            cy.findAllByRole('cell', {
                timeout: 2000,
            }).then((cells) => {
                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    '',
                    '/',
                    '',
                    'Correction',
                    'Nombre de films',
                    '',
                    '/api/run/count-all/',
                    '35',
                    'John DOE',
                    'To Review',
                    '',
                    new Date(2025, 1, 14).toLocaleDateString(),
                ]);
            });
        });

        it('should support cancel', () => {
            cy.findAllByRole('checkbox').eq(1).click();
            cy.findAllByRole('checkbox').eq(2).click();

            cy.findByRole('button', {
                name: 'Delete the selected annotation(s)',
                timeout: 2000,
            }).click();

            cy.findByRole('button', {
                name: 'Cancel',
                timeout: 2000,
            }).click();

            cy.findAllByRole('checkbox', {
                timeout: 2000,
            })
                .eq(1)
                .should('be.checked');
            cy.findAllByRole('checkbox').eq(2).should('be.checked');

            cy.findAllByRole('cell').should('have.length', 36);
        });
    });

    describe('delete filtered rows', () => {
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
            datasetImportPage.importModel('model/film-with-field-id.tar');

            cy.findByRole('gridcell', { name: 'Liste des films' }).trigger(
                'mouseenter',
            );
            cy.findByRole('button', { name: 'edit-Liste des films' }).click();

            cy.findByRole('tab', { name: 'Annotations' }).click();
            cy.findByRole('checkbox', {
                name: 'This field can be annotated',
            }).click();
            cy.findByRole('button', { name: 'Save' }).click();

            datasetImportPage.publish();

            cy.findByRole('button', {
                name: 'Open menu',
            }).click();

            cy.findByRole('menuitem', {
                name: 'Model',
            }).trigger('mouseleave');

            cy.findByRole('menuitem', {
                name: 'Annotations',
            }).trigger('mouseenter');

            cy.wait(500);

            fillInputWithFixture(
                'input[name="import_annotations"]',
                'annotations/film-many-annotations.json',
                'application/json',
            );

            cy.wait(1000);

            cy.findByText('Annotations').click();
        });

        it('should delete filtered annotations', () => {
            cy.findByText('Filters').click();
            cy.findByPlaceholderText('Filter value').type('/graph');

            cy.findByRole('button', {
                name: 'Delete the filtered annotations',
            }).click();

            cy.findByRole('button', {
                name: 'Delete',
            }).click();

            cy.findByText('1 annotation have been deleted.').should('exist');

            cy.findByText('No rows', {
                timeout: 1500,
            }).should('not.exist');

            cy.wait(500);

            cy.findAllByRole('cell', {
                timeout: 2000,
            }).then((cells) => {
                const firstUri = cells[1].textContent;

                expect(firstUri).to.match(/uid:\//);

                expect(
                    cells.toArray().map((cell) => cell.textContent),
                ).to.deep.equal([
                    '',
                    firstUri,
                    'Resource has been removed',
                    'Correction',
                    'rating',
                    '',
                    '6,4',
                    '7.5',
                    'Jane SMITH',
                    'To Review',
                    '',
                    new Date(2025, 1, 14).toLocaleDateString(),
                    '',
                    '/',
                    '',
                    'Correction',
                    'Nombre de films',
                    '',
                    '/api/run/count-all/',
                    '35',
                    'John DOE',
                    'To Review',
                    '',
                    new Date(2025, 1, 14).toLocaleDateString(),
                ]);
            });
        });

        it('should support cancel', () => {
            cy.findByText('Filters').click();
            cy.findByPlaceholderText('Filter value').type('/graph');

            cy.findByRole('button', {
                name: 'Delete the filtered annotations',
            }).click();

            cy.findByRole('button', {
                name: 'Cancel',
                timeout: 2000,
            }).click();

            cy.findAllByRole('cell').should('have.length', 12);
        });
    });

    describe('suggested value list with a single value', () => {
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

            cy.findByRole('tab', { name: 'Annotations' }).click();
            cy.findByLabelText('Annotation format').click();

            cy.findByRole('option', {
                name: 'Predefined values list',
            }).click();

            cy.findByRole('textbox', {
                name: 'Predefined values',
            }).type(`Article
Book
Revue`);
            cy.findByRole('button', { name: 'Save' }).click();

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
        });

        it('should support enforcing a list of values', () => {
            annotation.createAddValueWithSingleProposedValueChoiceAnnotation({
                fieldLabel: 'Liste des films',
                proposedValue: 'Book',
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
                    '',
                    '/',
                    '',
                    'Addition',
                    'Liste des films',
                    '',
                    '',
                    'Book',
                    'John Doe',
                    'To Review',
                    '',
                    new Date().toLocaleDateString(),
                ]);
            });
        });
    });
});
