import { login, teardown } from '../../support/authentication';
import * as menu from '../../support/menu';
import * as datasetImportPage from '../../support/datasetImportPage';

describe('ssr', () => {
    beforeEach(() => {
        teardown(true);
    });
    describe('/instance/default', () => {
        describe('authentified', () => {
            before(() => {
                cy.visit('/instance/default');
                login();
                menu.openAdvancedDrawer();
                menu.goToAdminDashboard();

                datasetImportPage.importDataset('dataset/hobbits.csv');
                datasetImportPage.importModel('model/hobbits.json');
                datasetImportPage.publish();

                cy.visit('/instance/default');
            });
            it.skip('should preload the dataset for home', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('dataset')
                    .its('dataset')
                    .should('deep.equal', [
                        {
                            uri: '1',
                            fullname: 'PEREGRIN.TOOK',
                            email: 'peregrin.took@shire.net',
                        },
                        {
                            uri: '2',
                            fullname: 'SAMSAGET.GAMGIE',
                            email: 'samsaget.gamgie@shire.net',
                        },
                        {
                            uri: '3',
                            fullname: 'BILBON.BAGGINS',
                            email: 'bilbon.saquet@shire.net',
                        },
                        {
                            uri: '4',
                            fullname: 'FRODO.BAGGINS',
                            email: 'frodo.saquet@shire.net',
                        },
                        {
                            uri: '5',
                            fullname: 'MERIADOC.BRANDYBUCK',
                            email: 'meriadoc.brandybuck@shire.net',
                        },
                    ]);
            });

            it('should preload fields for home', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('fields')
                    .its('list')
                    .should('deep.equal', [
                        'uri',
                        'fullname',
                        'email',
                        'title',
                        'author',
                    ]);
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('fields')
                    .its('byName')
                    .should('have.all.keys', [
                        'uri',
                        'fullname',
                        'email',
                        'title',
                        'author',
                    ]);
            });

            it('should preload characteristics for home', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('characteristic')
                    .its('characteristics')
                    .its(0)
                    .its('author')
                    .should('deep.equal', 'Tester');
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('characteristic')
                    .its('characteristics')
                    .its(0)
                    .its('title')
                    .should('deep.equal', 'The hobbits');
            });

            // TODO figure out why user key does not exists in state anymore
            it.skip('should not include token in state', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('user')
                    .its('token')
                    .should('deep.equal', null);
            });
        });

        describe.only('not authentified', () => {
            beforeEach(() => {
                cy.visit('/instance/default');
            });

            it('should redirect to login', () => {
                cy.url().should(
                    'eq',
                    `http://localhost:3000/instance/default/login`,
                );
            });

            it('should not preload the dataset for home', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('dataset')
                    .its('dataset')
                    .should('deep.equal', []);
            });

            it.only('should not preload fields for home', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('fields')
                    .its('list')
                    .should('deep.equal', []);
            });

            it.only('should not preload characteristics for home', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('characteristic')
                    .its('characteristics')
                    .should('deep.equal', []);
            });

            it.only('should not preload exporters for home', () => {
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('export')
                    .its('exporters')
                    .should('deep.equal', []);
            });

            it.skip('should not include token in state', () => {
                // TODO find out why user key i sno longer present
                cy.window()
                    .its('__PRELOADED_STATE__')
                    .its('user')
                    .its('token')
                    .should('deep.equal', null);
            });
        });
    });
});
