import * as annotation from '../../support/annotation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as menu from '../../support/menu';
import * as searchDrawer from '../../support/searchDrawer';

describe('Annotation', () => {
    describe('suggested value list with multiple values', () => {
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

            cy.findByLabelText('Select *').click();

            cy.findByRole('option', {
                name: 'Multiple choice',
            }).click();

            cy.findByRole('button', { name: 'Save' }).click();

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
        });

        it('should support enforcing a list of values and selecting multiple options', () => {
            annotation.createAddValueWithMultipleProposedValuesChoiceAnnotation(
                {
                    fieldLabel: 'Liste des films',
                    proposedValues: ['Book', 'Revue'],
                    comment: 'This is a comment',
                    authorName: 'John Doe',
                    authorEmail: 'john.doe@example.org',
                },
            );

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
                    '[ Book, Revue ]',
                    'John Doe',
                    'To Review',
                    '',
                    new Date().toLocaleDateString(),
                ]);
            });
        });
    });

    describe('see own annotations', () => {
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

            datasetImportPage.importAnnotations(
                'annotations/film-with-field-id.json',
            );

            datasetImportPage.goToPublishedResources();
        });

        it('should see own annotations from create annotation button', () => {
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
            annotation.createTitleAnnotation({
                fieldLabel: 'Dataset Description',
                comment: 'This is my comment',
                authorName: 'Me',
                authorEmail: 'me@myself.org',
            });

            cy.findByText('1 sent').should('be.visible');

            annotation.openAnnotationModalForField('Dataset Description');
            cy.findByText(`See 2 annotations`).should('be.visible');
            cy.findByText(`See 2 annotations`).click();

            cy.findByLabelText('Resource title').should(
                'have.text',
                'Home page',
            );

            cy.findByText('All contributors').should('be.visible');
            cy.findByText('Only me').should('be.visible');

            cy.findAllByLabelText('Type').should('have.length', 2);
            cy.findAllByLabelText('Annotation summary').should(
                'have.length',
                2,
            );
            cy.findAllByLabelText('Status').should('have.length', 2);

            cy.findByText('Only me').click();

            cy.findAllByLabelText('Type').should('have.length', 1);
            cy.findAllByLabelText('Annotation summary').should(
                'have.length',
                1,
            );
            cy.findAllByLabelText('Status').should('have.length', 1);
            cy.findByLabelText('Type').should('have.text', 'Comment');

            cy.findByLabelText('Annotation summary').should(
                'have.text',
                'This is my comment',
            );
            cy.findByLabelText('Status').should('have.text', 'Ongoing');

            cy.findByText('You are the contributor of this annotation').should(
                'be.visible',
            );
        });

        it('should see own annotations from annotation count on field', () => {
            annotation.createTitleAnnotation({
                fieldLabel: 'Dataset Description',
                comment: 'This is my comment',
                authorName: 'Me',
                authorEmail: 'me@myself.org',
            });

            cy.findByText('1 sent').click();

            cy.findByText('All contributors').should('be.visible');
            cy.findByText('Only me').should('be.visible');

            cy.findAllByLabelText('Type').should('have.length', 1);
            cy.findAllByLabelText('Annotation summary').should(
                'have.length',
                1,
            );
        });
    });

    describe('remind me', () => {
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

            datasetImportPage.importAnnotations(
                'annotations/film-with-field-id.json',
            );

            datasetImportPage.goToPublishedResources();
        });

        it('should remember author of an annotation and if it is name is public', () => {
            annotation.createTitleAnnotation({
                fieldLabel: 'Dataset Description',
                comment: 'This is my comment',
                authorName: 'Me',
                authorEmail: 'me@myself.org',
                isContributorNamePublic: true,
                authorRememberMe: true,
            });

            annotation.openAnnotationModalForField('Dataset Description');
            annotation.targetSection();
            annotation.fillComment('This is another comment');
            annotation.goToNextStep();

            annotation.authorNameField().should('have.value', 'Me');
            annotation.authorEmailField().should('have.value', 'me@myself.org');
            annotation
                .isContributorNamePublicField()
                .should('be.checked')
                .uncheck();
            annotation.authorRememberMeField().should('be.checked').uncheck();

            annotation.submitAnnotation();

            annotation.openAnnotationModalForField('Dataset Description');
            annotation.targetSection();
            annotation.fillComment('This is another comment');
            annotation.goToNextStep();

            annotation.authorNameField().should('have.value', '');
            annotation.authorEmailField().should('have.value', '');
            annotation.authorRememberMeField().should('not.be.checked');

            annotation.isContributorNamePublicField().should('not.be.checked');
        });
    });

    describe('annotation details actions', () => {
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

            datasetImportPage.importAnnotations(
                'annotations/film-many-annotations.json',
            );
            datasetImportPage.goToPublishedResources();

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

            cy.findByText('More').click();
            menu.goToAdminDashboard();
            cy.findByRole('link', { name: 'Annotations' }).click();
        });

        it('should redirect to the resource if exists', () => {
            cy.findByText('Terminator 2').click();

            cy.findByText('See the resource', {
                timeout: 1000,
            })
                .should('be.visible')
                .should('not.be.disabled')
                .should('have.attr', 'target', '_blank')
                .invoke('removeAttr', 'target')
                .click();

            cy.findByText('actors', {
                timeout: 1000,
            }).should('be.visible');
        });

        it('should redirect to the data list with filtered uri', () => {
            cy.findByText('Terminator 2').click();

            cy.findByText('Update data', {
                timeout: 1000,
            })
                .should('be.visible')
                .should('not.be.disabled')
                .should('have.attr', 'target', '_blank')
                .invoke('removeAttr', 'target')
                .click();

            cy.waitForNetworkIdle(1000);
            cy.findByRole('progressbar').should('not.exist');

            cy.findByText('1–1 of 1').should('be.visible');

            cy.findByText('"Terminator 2"').should('be.visible');

            cy.waitForNetworkIdle(1000);
            cy.findByRole('progressbar').should('not.exist');

            cy.findByText('Filters').click();

            cy.findByLabelText('value').should('not.be.empty');

            cy.findAllByRole('cell').should('have.length', 12); // nombre de colonnes dans le tableau + cellule en bas à droite (pagination)
        });

        it('should disable the "See the resource" button if the resource does not exist', () => {
            cy.findByText('rating').click();

            cy.findByText('See the resource', {
                timeout: 1000,
            })
                .should('be.visible')
                .should('be.disabled');
        });

        it('should redirect to the home page', () => {
            cy.findByText('Nombre de films').click();

            cy.findByText('See home page', {
                timeout: 1000,
            })
                .should('be.visible')
                .should('not.be.disabled')
                .should('have.attr', 'target', '_blank')
                .invoke('removeAttr', 'target')
                .click();

            cy.findByRole('heading', {
                name: 'Une collection de films célébres',
                timeout: 1000,
            }).should('exist');
        });

        it('should redirect to the graph page', () => {
            cy.findByText('/graph/TK2J').click();

            cy.findByText('See the graph', {
                timeout: 1000,
            })
                .should('be.visible')
                .should('not.be.disabled')
                .should('have.attr', 'target', '_blank')
                .invoke('removeAttr', 'target')
                .click();

            cy.findByText('rating').should('exist');
        });
    });

    describe('disable annotation kind', () => {
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

            cy.findByRole('link', {
                name: 'Display',
            });

            cy.findByRole('gridcell', {
                name: 'Dataset Name',
                timeout: 1500,
            })
                .should('be.visible')
                .trigger('mouseenter');
            cy.findByRole('button', { name: 'edit-Dataset Name' }).click();
            cy.findByRole('tab', { name: 'Annotations' }).click();
        });

        it('should no display correction button if disabled', () => {
            cy.findByRole('checkbox', {
                name: 'Correct content',
            }).click();

            cy.findByRole('button', {
                name: 'Save',
            }).click();

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();

            cy.findByRole('button', {
                name: 'Add an annotation to the Dataset Name field',
            }).click();

            cy.findByRole('menuitem', {
                name: 'Annotate the field',
            }).should('exist');

            cy.findByRole('menuitem', {
                name: 'Correct some content',
            }).should('not.exist');

            cy.findByRole('menuitem', {
                name: 'Add some content',
            }).should('exist');

            cy.findByRole('menuitem', {
                name: 'Remove some content',
            }).should('exist');
        });

        it('should no display add button if disabled', () => {
            cy.findByRole('checkbox', {
                name: 'Add content',
            }).click();

            cy.findByRole('button', {
                name: 'Save',
            }).click();

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();

            cy.findByRole('button', {
                name: 'Add an annotation to the Dataset Name field',
            }).click();

            cy.findByRole('menuitem', {
                name: 'Annotate the field',
            }).should('exist');

            cy.findByRole('menuitem', {
                name: 'Correct some content',
            }).should('exist');

            cy.findByRole('menuitem', {
                name: 'Add some content',
            }).should('not.exist');

            cy.findByRole('menuitem', {
                name: 'Remove some content',
            }).should('exist');
        });

        it('should no display remove button if disabled', () => {
            cy.findByRole('checkbox', {
                name: 'Remove content',
            }).click();

            cy.findByRole('button', {
                name: 'Save',
            }).click();

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();

            cy.findByRole('button', {
                name: 'Add an annotation to the Dataset Name field',
            }).click();

            cy.findByRole('menuitem', {
                name: 'Annotate the field',
            }).should('exist');

            cy.findByRole('menuitem', {
                name: 'Correct some content',
            }).should('exist');

            cy.findByRole('menuitem', {
                name: 'Add some content',
            }).should('exist');

            cy.findByRole('menuitem', {
                name: 'Remove some content',
            }).should('not.exist');
        });

        it('should open comment step if all annotation types are disabled', () => {
            cy.findByRole('checkbox', {
                name: 'Correct content',
            }).click();

            cy.findByRole('checkbox', {
                name: 'Add content',
            }).click();

            cy.findByRole('checkbox', {
                name: 'Remove content',
            }).click();

            cy.findByRole('button', {
                name: 'Save',
            }).click();

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();

            cy.findByRole('button', {
                name: 'Add an annotation to the Dataset Name field',
            }).click();

            cy.findByText('General commentary').should('be.visible');
        });
    });
});
