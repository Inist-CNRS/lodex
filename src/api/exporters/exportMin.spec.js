import expect from 'expect';
import from from 'from';
import exportMin from './exportMin';

describe('exportMin', () => {
    // FIXME: this test should not pass as is.
    it.skip('should return a minimal record', (done) => {
        const config = {
            cleanHost: 'http://project-study-1',
        };
        const fields = [{
            cover: 'collection',
            overview: 1,
            name: 'title',
        }];
        const exportedJson = exportMin(
            config,
            fields,
            null,
            from([{
                uri: 'http://uri',
                title: 'Title',
            }]),
        );

        // This is not what should came out of exportMin
        expect(Object.keys(exportedJson)).toEqual([
            '_readableState',
            'readable',
            'domain',
            '_events',
            '_eventsCount',
            '_maxListeners',
            '_writableState',
            'writable',
            'allowHalfOpen',
            '_transformState',
            'func',
            'index',
            'params',
            'scope']);
        done();
    });
});
