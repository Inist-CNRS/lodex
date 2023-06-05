const from = require('from');
const ezs = require('@ezs/core');

ezs.use(require('@ezs/basics'));

test.skip('export one resource in a two-lines TSV', done => {
    let outputString = '';
    from([
        {
            uri: 'http://resource.uri',
            title: 'first resource',
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/tsv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(3);
            expect(res).toEqual([
                'uri\ttitle',
                'http://resource.uri\tfirst resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export two resources in a three-lines TSV', done => {
    let outputString = '';
    from([
        {
            uri: 'http://resource.uri/1',
            title: 'first resource',
        },
        {
            uri: 'http://resource.uri/2',
            title: 'second resource',
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/tsv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(4);
            expect(res).toEqual([
                'uri\ttitle',
                'http://resource.uri/1\tfirst resource',
                'http://resource.uri/2\tsecond resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export in TSV resources containing quotes', done => {
    let outputString = '';
    from([
        {
            uri: 'http://resource.uri/1',
            title: 'first "resource"',
        },
        {
            uri: 'http://resource.uri/2',
            title: 'second resource',
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/tsv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(4);
            expect(res).toEqual([
                'uri\ttitle',
                'http://resource.uri/1\t"first ""resource"""',
                'http://resource.uri/2\tsecond resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export in TSV resources containing tabulation', done => {
    let outputString = '';
    from([
        {
            uri: 'http://resource.uri/1',
            title: 'first\tresource',
        },
        {
            uri: 'http://resource.uri/2',
            title: 'second resource',
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/tsv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(4);
            expect(res).toEqual([
                'uri\ttitle',
                'http://resource.uri/1\t"first\tresource"',
                'http://resource.uri/2\tsecond resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export TSV with labels in header', done => {
    let outputString = '';
    from([
        {
            uri: 'http://resource.uri/1',
            AbCd: 'first;resource',
        },
        {
            uri: 'http://resource.uri/2',
            AbCd: 'second resource',
        },
    ])
        .pipe(
            ezs(
                'delegate',
                { file: __dirname + '/tsv.ini' },
                { fields: [{ name: 'AbCd', label: 'Title' }] },
            ),
        )
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(4);
            expect(res).toEqual([
                'uri\tTitle',
                'http://resource.uri/1\tfirst;resource',
                'http://resource.uri/2\tsecond resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});
