// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set t... Remove this comment to see the full error message
import statements from '../src';
import testOne from './testOne';

const dataTest = [
    {
        uri: 'http://data.istex.fr',
        Q98n: 'Terminator',
        JDGh: 'Description',
    },
];
const expectedJson = {
    uri: 'http://data.istex.fr',
    fields: [
        {
            name: 'Q98n',
            value: 'Terminator',
            label: 'title',
            language: 'fr',
        },
        {
            name: 'JDGh',
            value: 'Description',
            label: 'Abstract',
            language: undefined,
        },
    ],
};

const fields = [
    {
        label: 'title',
        name: 'Q98n',
        language: 'fr',
    },
    {
        label: 'Abstract',
        name: 'JDGh',
    },
];

ezs.use(statements);
describe('conversion to json', () => {
    it('should return json from the dataset', (done) => {
        const stream = from(dataTest).pipe(ezs('convertToJson', { fields }));
        testOne(
            stream,
            (data: any) => {
                // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                expect(data).toEqual(expectedJson);
            },
            done,
        );
    });
});
