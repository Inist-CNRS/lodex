import expect from 'expect';
import omit from 'lodash.omit';

import requestServer from './utils/requestServer';
import fixtures from './ssr.json';
import {
    connect,
    clear,
    loadFixtures,
    close,
} from '../../common/tests/fixtures';
import exporters from '../exporters';
import config from '../../../config.json';

describe('ssr', () => {
    let server;
    before(async () => {
        server = requestServer();
        await clear();
        await connect();
        await loadFixtures(fixtures);
    });

    describe('/home', () => {
        let state;
        before(async () => {
            const response = await server.get('/home');
            state = JSON.parse(
                response.match(/__PRELOADED_STATE__ = ([\s\S]*?)<\/script>/)[1],
            );
        });

        it('should preload the dataset for home', async () => {
            expect(state.dataset.dataset).toEqual([
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

        it('should preload fields for /home', () => {
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

        it('should preload characteristics for /home', async () => {
            expect(
                state.characteristic.characteristics.map(d => omit(d, '_id')),
            ).toEqual([{ movie: 'LOTR', author: 'Peter Jackson' }]);
        });

        it('should preload exporters for home', async () => {
            expect(state.export.exporters).toEqual(
                config.exporters.map(name => ({
                    name,
                    type: exporters[name].type,
                })),
            );
        });
    });

    describe('/resource', () => {
        let state;
        before(async () => {
            const response = await server.get('/resource?uri=1');
            state = JSON.parse(
                response.match(/__PRELOADED_STATE__ = ([\s\S]*?)<\/script>/)[1],
            );
        });

        it('should preload fields for /home', () => {
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

        it('should preload characteristics for /home', async () => {
            expect(
                state.characteristic.characteristics.map(d => omit(d, '_id')),
            ).toEqual([{ movie: 'LOTR', author: 'Peter Jackson' }]);
        });

        it('should preload resource', async () => {
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
    });

    describe('/graph', () => {
        let state;
        before(async () => {
            const response = await server.get('/graph');
            state = JSON.parse(
                response.match(/__PRELOADED_STATE__ = ([\s\S]*?)<\/script>/)[1],
            );
        });

        it('should preload the dataset for home', async () => {
            expect(state.dataset.dataset).toEqual([
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

        it('should preload fields for /home', () => {
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

        it('should preload characteristics for /home', async () => {
            expect(
                state.characteristic.characteristics.map(d => omit(d, '_id')),
            ).toEqual([{ movie: 'LOTR', author: 'Peter Jackson' }]);
        });
    });

    after(async () => {
        server.close();

        await clear();
        await close();
    });
});
