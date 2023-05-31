const from = require('from');
const ezs = require('@ezs/core');

// ezs.use(require('ezs-basics'));
// ezs.use(require('ezs-lodex'));
// ezs.use(require('ezs-istex'));

const labels = 'query';
const linked = 'language';
const context = {
    language: 'http://uri/language',
    title:'http://uri/title',
};
const fields = [{
    name: 'istexQuery',
    label: 'query',
    format: {
        name: 'istex',
    },
}, {
    name: 'title'
}];

test.skip('export single resource', done => {
    let outputString = '';
    from([{
        uri: 'http://uri',
        title: 'First title',
        istexQuery: 'language.raw:rum',
    }])
        .pipe(ezs('delegate', { file: __dirname + '/extended-nquads.ini' }, { labels, linked, context, fields }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toHaveLength(2);
            expect(res[0]).toEqual('<https://api.istex.fr/ark:/67375/NDQ-W42TSQDR-H> <http://uri/language> <http://uri> .');
            done();
        })
        .on('error', done);
});

test.skip('export two resources', done => {
    let outputString = '';
    from([{
        uri: 'http://uri/1',
        title: 'First title',
        istexQuery: 'language.raw:rum',
    }, {
        uri: 'http://uri/2',
        title: 'Second title',
        istexQuery: 'language.raw:san',
    }])
        .pipe(ezs('delegate', { file: __dirname + '/extended-nquads.ini' }, { labels, linked, context, fields }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toHaveLength(3);
            expect(res[0]).toEqual('<https://api.istex.fr/ark:/67375/NDQ-W42TSQDR-H> <http://uri/language> <http://uri/1> .');
            expect(res[1]).toEqual('<https://api.istex.fr/ark:/67375/6ZK-VMC2N7W5-9> <http://uri/language> <http://uri/2> .');
            done();
        })
        .on('error', done);
});

test.skip('export single resource with more documents', done => {
    let outputString = '';
    from([{
        uri: 'http://uri/cat',
        title: 'First title',
        istexQuery: 'language.raw:cat',
    }])
        .pipe(ezs('delegate', { file: __dirname + '/extended-nquads.ini' }, { labels, linked, context, fields }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toHaveLength(10);
            expect(res[0]).toEqual('<https://api.istex.fr/ark:/67375/8QZ-ZD0W8F1F-N> <http://uri/language> <http://uri/cat> .');
            expect(res[1]).toEqual('<https://api.istex.fr/ark:/67375/8QZ-D0VV05V0-2> <http://uri/language> <http://uri/cat> .');
            expect(res[2]).toEqual('<https://api.istex.fr/ark:/67375/8QZ-G1FHMTKW-9> <http://uri/language> <http://uri/cat> .');
            expect(res[3]).toEqual('<https://api.istex.fr/ark:/67375/8QZ-JQD1H3HP-Q> <http://uri/language> <http://uri/cat> .');
            expect(res[4]).toEqual('<https://api.istex.fr/ark:/67375/6H6-NTDRQKJZ-W> <http://uri/language> <http://uri/cat> .');
            done();
        })
        .on('error', done);
});
