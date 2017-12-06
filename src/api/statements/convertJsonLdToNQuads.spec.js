// import path from 'path';
// import fs from 'fs';
// import request from 'request';
// import ezs from 'ezs';
// import from from 'from';
// import sinon from 'sinon';
// import { expect } from 'chai';
// import testAll from './testAll';

// const dataTest = require('./fixture.data.json');
// const dataNquads = fs.readFileSync(
//     path.resolve(__dirname, './fixture.data.nq'),
//     'utf8',
// );
// const ezsLocals = require('.');

// const config = {
//     istexQuery: {
//         labels: '',
//         linked: 'language',
//         context: {
//             language: 'http://purl.org/ontology/dc/language',
//             doi: 'http://purl.org/ontology/bibo/doi',
//         },
//     },
// };

// ezs.use(ezsLocals);
// describe('conversion to extended Nquads', () => {
//     let sandbox;
//     beforeEach(() => {
//         sandbox = sinon.sandbox.create();
//         const s = sandbox.stub(request, 'get');
//         s.onFirstCall().yields(null, { statusCode: 200 }, dataTest[0]);
//         s.onSecondCall().yields(null, { statusCode: 200 }, dataTest[1]);
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     it('should return nquads from the dataset', done => {
//         /* Fake URL */
//         const stream = from([
//             {
//                 lodex: { uri: 'https://lodex-uri.fr/URI' },
//                 content: 'https://api-v5.istex.fr/document/?q=language:test',
//             },
//         ])
//             .pipe(ezs('scroll'))
//             .pipe(ezs('convertToExtendedJsonLd', { config }));
//         testAll(
//             stream,
//             data => {
//                 const lines = data.split('\n');
//                 expect(dataNquads.includes(lines[0]));
//                 expect(dataNquads.includes(lines[1]));
//                 expect(dataNquads.includes(lines[2]));
//                 expect(dataNquads.includes(lines[3]));
//                 expect(dataNquads.includes(lines[4]));
//                 expect(dataNquads.includes(lines[5]));
//                 expect(dataNquads.includes(lines[6]));
//             },
//             done,
//         );
//     });
// });

import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import testOne from './testOne';

const statements = require('.');
ezs.use(statements);

describe.only('convertJSonLdToNquads', () => {
    it('should convert a correct JSON-LD into NQuads', done => {
        // see https://json-ld.org/playground/ for the Person example
        const stream = from([
            {
                '@id': 'http://uri/janedoe',
                '@context': 'http://schema.org/',
                '@type': 'Person',
                name: 'Jane Doe',
                jobTitle: 'Professor',
                telephone: '(425) 123-4567',
                url: 'http://www.janedoe.com',
            },
        ]).pipe(ezs('convertJsonLdToNQuads'));
        const expectedNquads = [
            '<http://uri/janedoe> <http://schema.org/jobTitle> "Professor" .',
            '<http://uri/janedoe> <http://schema.org/name> "Jane Doe" .',
            '<http://uri/janedoe> <http://schema.org/telephone> "(425) 123-4567" .',
            '<http://uri/janedoe> <http://schema.org/url> <http://www.janedoe.com> .',
            '<http://uri/janedoe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Person> .',
        ];
        testOne(
            stream,
            data => {
                const lines = data.split('\n');
                expect(expectedNquads).toInclude(lines[0]);
                expect(expectedNquads).toInclude(lines[1]);
                expect(expectedNquads).toInclude(lines[2]);
                expect(expectedNquads).toInclude(lines[3]);
                expect(expectedNquads).toInclude(lines[4]);
            },
            done,
        );
    });
});
