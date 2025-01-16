import { omit } from 'lodash';
import { DEFAULT_TENANT } from '../../../src/common/tools/tenantTools';
import { login, teardown } from '../../support/authentication';
import * as menu from '../../support/menu';
import * as datasetImportPage from '../../support/datasetImportPage';

describe('ssr', () => {
    beforeEach(() => {
        teardown(true);
    });
    describe('/instance/default', () => {
        describe('authentified', () => {
            it.only('should preload the dataset for home', async () => {
                cy.visit('/instance/default');
                login();
                menu.openAdvancedDrawer();
                menu.goToAdminDashboard();

                datasetImportPage.importDataset('dataset/chart.csv');
                datasetImportPage.importModel('model/chart.json');
                datasetImportPage.publish();
                datasetImportPage.goToPublishedResources();

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
                cy.visit('/instance/default');

                let state;
                cy.get('head').then((head) => {
                    let headToText = JSON.stringify(head.html());
                    state = JSON.parse(
                        headToText.match(
                            /__PRELOADED_STATE__ = ({[\s\S]*?});/,
                        )[1],
                    );
                });
                expect(state.fields.list).toEqual([
                    'uri',
                    'fullname',
                    'email',
                    'movie',
                    'author',
                ]);
                expect(Object.keys(state.fields.byName)).toEqual([
                    'uri',
                    'fullname',
                    'email',
                    'movie',
                    'author',
                ]);
            });

            it('should preload characteristics for home', () => {
                cy.visit('/instance/default');

                let state;
                cy.get('head').then((head) => {
                    let headToText = JSON.stringify(head.html());
                    state = JSON.parse(
                        headToText.match(
                            /__PRELOADED_STATE__ = ({[\s\S]*?});/,
                        )[1],
                    );
                });
                expect(
                    state.characteristic.characteristics.map((d) =>
                        omit(d, '_id'),
                    ),
                ).toEqual([{ movie: 'LOTR', author: 'Peter Jackson' }]);
            });

            it('should not include token in state', () => {
                cy.visit('/instance/default');

                let state;
                cy.get('head').then((head) => {
                    let headToText = JSON.stringify(head.html());
                    state = JSON.parse(
                        headToText.match(
                            /__PRELOADED_STATE__ = ({[\s\S]*?});/,
                        )[1],
                    );
                });
                expect(state.user).toEqual({
                    token: null,
                });
            });
        });

        describe('not authentified', () => {
            let state;
            beforeEach(async () => {
                cy.visit('/instance/default');

                cy.get('head').then((head) => {
                    let headToText = JSON.stringify(head.html());
                    state = JSON.parse(
                        headToText.match(
                            /__PRELOADED_STATE__ = ({[\s\S]*?});/,
                        )[1],
                    );
                });
            });

            it('should redirect to login', () => {
                expect(state.router.location.pathname).toBe(
                    `/instance/${DEFAULT_TENANT}/login`,
                );
            });

            it('should not preload the dataset for home', () => {
                expect(state.dataset.dataset).toEqual([]);
            });

            it('should not preload fields for home', () => {
                expect(state.fields.list).toEqual([]);
                expect(Object.keys(state.fields.byName)).toEqual([]);
            });

            it('should not preload characteristics for home', () => {
                expect(state.characteristic.characteristics).toEqual([]);
            });

            it('should not preload exporters for home', () => {
                expect(state.export.exporters).toEqual([]);
            });

            it('should not include token in state', () => {
                expect(state.user).toEqual({
                    token: null,
                });
            });
        });
    });

    describe('/resource', () => {
        describe('authentified', () => {
            let state;
            beforeEach(async () => {
                cy.visit('/instance/default');

                await cy.get('head').then((head) => {
                    let headToText = JSON.stringify(head.html());
                    state = JSON.parse(
                        headToText.match(
                            /__PRELOADED_STATE__ = ({[\s\S]*?});/,
                        )[1],
                    );
                });
            });

            it('should preload fields', () => {
                expect(state.fields.list).toEqual([
                    'uri',
                    'fullname',
                    'email',
                    'movie',
                    'author',
                ]);
                expect(Object.keys(state.fields.byName)).toEqual([
                    'uri',
                    'fullname',
                    'email',
                    'movie',
                    'author',
                ]);
            });

            it('should preload characteristics', () => {
                expect(
                    state.characteristic.characteristics.map((d) =>
                        omit(d, '_id'),
                    ),
                ).toEqual([{ movie: 'LOTR', author: 'Peter Jackson' }]);
            });

            it('should preload resource', () => {
                expect(omit(state.resource.resource, '_id')).toEqual({
                    uri: '1',
                    versions: [
                        {
                            fullname: 'PEREGRIN.TOOK',
                            email: 'peregrin.took@shire.net',
                        },
                    ],
                });
            });

            it('should not include token in state', () => {
                expect(state.user).toEqual({
                    token: null,
                });
            });
        });

        describe('not authentified', () => {
            let state;
            beforeEach(async () => {
                cy.visit('/instance/default');

                await cy.get('head').then((head) => {
                    let headToText = JSON.stringify(head.html());
                    state = JSON.parse(
                        headToText.match(
                            /__PRELOADED_STATE__ = ({[\s\S]*?});/,
                        )[1],
                    );
                });
            });

            it('should redirect to login', () => {
                expect(state.router.location.pathname).toBe('/login');
            });

            it('should not preload fields', () => {
                expect(state.fields.list).toEqual([]);
                expect(Object.keys(state.fields.byName)).toEqual([]);
            });

            it('should not preload characteristics', () => {
                expect(
                    state.characteristic.characteristics.map((d) =>
                        omit(d, '_id'),
                    ),
                ).toEqual([]);
            });

            it('should not preload resource', () => {
                expect(omit(state.resource.resource, '_id')).toEqual({});
            });

            it('should not include token in state', () => {
                expect(state.user).toEqual({
                    token: null,
                });
            });
        });
    });
});
