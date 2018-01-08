import expect from 'expect';

import { uniqueField } from './FieldLabelInput';

describe('FieldLabelInput', () => {
    const polyglot = {
        t: v => v,
    };
    describe('validator: uniqueField', () => {
        it('should return error message if value is the label of an existing field other than itself', () => {
            expect(
                uniqueField(
                    [
                        { label: 'a label' },
                        { label: 'another label' },
                        { label: 'my label' },
                    ],
                    polyglot,
                )('my label', null, {}),
            ).toBe('field_label_exists');
        });

        it('should return undefined if value is equal to props.fieldToAdd.label', () => {
            expect(
                uniqueField(
                    [
                        { label: 'a label' },
                        { label: 'another label' },
                        { label: 'my label' },
                    ],
                    polyglot,
                )('my label', null, {
                    fieldToAdd: { label: 'my label' },
                }),
            ).toBe(undefined);
        });

        it('should return undefined if value is equal to props.field.label', () => {
            expect(
                uniqueField(
                    [
                        { label: 'a label' },
                        { label: 'another label' },
                        { label: 'my label' },
                    ],
                    polyglot,
                )('my label', null, {
                    field: { label: 'my label' },
                }),
            ).toBe(undefined);
        });

        it('should return undefined if value is not in one of the other existing fields', () => {
            expect(
                uniqueField(
                    [{ label: 'a label' }, { label: 'another label' }],
                    polyglot,
                )('my label', null, {}),
            ).toBe(undefined);
        });
    });
});
