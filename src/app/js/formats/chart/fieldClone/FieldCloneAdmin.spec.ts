import { isValidClonableField } from './FieldCloneAdmin';

import {
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_DOCUMENT,
    SCOPE_COLLECTION,
} from '../../../../../common/scope';

describe('isValidClonableField', () => {
    it('a "fieldClone" field should not be clonable (infinite loop)', () => {
        const field = {
            name: 'toto',
            scope: SCOPE_DATASET,
            format: { name: 'fieldClone' },
        };

        expect(isValidClonableField(field, SCOPE_DATASET)).toBe(false);
    });

    it('a "all-others-format" field should be clonable', () => {
        const field = {
            name: 'toto',
            scope: SCOPE_DATASET,
            format: { name: 'all-others-format' },
        };

        expect(isValidClonableField(field, SCOPE_DATASET)).toBe(true);
    });

    it('a not formated field should be clonable', () => {
        const field = {
            name: 'toto',
            scope: SCOPE_DATASET,
        };

        expect(isValidClonableField(field, SCOPE_DATASET)).toBe(true);
    });

    it('a field from home page should not be clonable on a resource page', () => {
        const fieldA = {
            name: 'toto',
            scope: SCOPE_DATASET,
        };

        expect(isValidClonableField(fieldA, SCOPE_COLLECTION)).toBe(false);

        const fieldB = {
            name: 'toto',
            scope: SCOPE_DATASET,
        };

        expect(isValidClonableField(fieldB, SCOPE_DOCUMENT)).toBe(false);
    });

    it('a field from graphic page should not be clonable on a resource page', () => {
        const fieldA = {
            name: 'toto',
            scope: SCOPE_GRAPHIC,
        };

        expect(isValidClonableField(fieldA, SCOPE_COLLECTION)).toBe(false);

        const fieldB = {
            name: 'toto',
            scope: SCOPE_GRAPHIC,
        };

        expect(isValidClonableField(fieldB, SCOPE_DOCUMENT)).toBe(false);
    });

    it('a field from a resource page should not be clonable on the home page', () => {
        const fieldA = {
            name: 'toto',
            scope: SCOPE_COLLECTION,
        };

        expect(isValidClonableField(fieldA, SCOPE_DATASET)).toBe(false);

        const fieldB = {
            name: 'toto',
            scope: SCOPE_DOCUMENT,
        };

        expect(isValidClonableField(fieldB, SCOPE_DATASET)).toBe(false);
    });

    it('a field from a resource page should not be clonable on the graphic page', () => {
        const fieldA = {
            name: 'toto',
            scope: SCOPE_COLLECTION,
        };

        expect(isValidClonableField(fieldA, SCOPE_GRAPHIC)).toBe(false);

        const fieldB = {
            name: 'toto',
            scope: SCOPE_DOCUMENT,
        };

        expect(isValidClonableField(fieldB, SCOPE_GRAPHIC)).toBe(false);
    });

    it('a field from a resource page should be clonable on a resource page', () => {
        const field = {
            name: 'toto',
            scope: SCOPE_COLLECTION,
        };

        expect(isValidClonableField(field, SCOPE_DOCUMENT)).toBe(true);
    });

    it('a field from the graphic page should be clonable on the home page', () => {
        const field = {
            name: 'toto',
            scope: SCOPE_GRAPHIC,
        };

        expect(isValidClonableField(field, SCOPE_DATASET)).toBe(true);
    });

    it('a field from the home page should be clonable on the graphic page', () => {
        const field = {
            name: 'toto',
            scope: SCOPE_DATASET,
        };

        expect(isValidClonableField(field, SCOPE_GRAPHIC)).toBe(true);
    });
});
