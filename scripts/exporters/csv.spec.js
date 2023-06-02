const from = require('from');
const ezs = require('@ezs/core');

ezs.use(require('@ezs/basics'));

test.skip('export one resource in a two-lines CSV', done => {
    let outputString = '';
    from([
        {
            uri: 'http://resource.uri',
            title: 'first resource',
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/csv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(3);
            expect(res).toEqual([
                'uri;title',
                'http://resource.uri;first resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export two resources in a three-lines CSV', done => {
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
        .pipe(ezs('delegate', { file: __dirname + '/csv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(4);
            expect(res).toEqual([
                'uri;title',
                'http://resource.uri/1;first resource',
                'http://resource.uri/2;second resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export in CSV resources containing quotes', done => {
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
        .pipe(ezs('delegate', { file: __dirname + '/csv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(4);
            expect(res).toEqual([
                'uri;title',
                'http://resource.uri/1;"first ""resource"""',
                'http://resource.uri/2;second resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export in CSV resources containing semicolon', done => {
    let outputString = '';
    from([
        {
            uri: 'http://resource.uri/1',
            title: 'first;resource',
        },
        {
            uri: 'http://resource.uri/2',
            title: 'second resource',
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/csv.ini' }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\r\n');
            expect(res).toHaveLength(4);
            expect(res).toEqual([
                'uri;title',
                'http://resource.uri/1;"first;resource"',
                'http://resource.uri/2;second resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export CSV with labels in header', done => {
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
                { file: __dirname + '/csv.ini' },
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
                'uri;Title',
                'http://resource.uri/1;"first;resource"',
                'http://resource.uri/2;second resource',
                '',
            ]);
            done();
        })
        .on('error', done);
});
