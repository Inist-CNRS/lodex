import { shouldDisplayField } from './shouldDisplayField';

import { VALIDATED, REJECTED } from '../../../common/propositionStatus';

describe('shouldDisplayField', () => {
    describe('with an empty field', () => {
        it('should display an empty field for an admin', () => {
            const field = { name: 'empty' };
            const resource = {};
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should not display an empty field for a user', () => {
            const field = { name: 'empty' };
            const resource = {};
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(false);
        });

        it('should should not display an empty field if the user status is not defined', () => {
            const field = { name: 'empty' };
            const resource = {};
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(false);
        });

        it('should should not display an empty field if the field status is rejected', () => {
            const field = { name: 'empty' };
            const resource = {};
            const fieldStatus = REJECTED;
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(false);
        });
    });

    describe('with a filled simple field', () => {
        it('should display a filled field for an admin', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should display a filled field for a user', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should display a filled field if the user status is not defined', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should not display a filled field for a user if predicate is false', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const fieldStatus = VALIDATED;
            const predicate = () => false;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(false);
        });

        it('should not display a filled field for a user if the field status is rejected', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const fieldStatus = REJECTED;
            const predicate = () => false;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(false);
        });
    });

    describe('with an empty composed field', () => {
        it('should display an empty composed field for an admin', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should not display an empty composed field for a user', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should not display an empty composed field if the user status is not defined', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should not display an empty composed field for a user if the field status is rejected', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const fieldStatus = REJECTED;
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(false);
        });

        it('should display a filled composed field for an admin', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should display a filled composed field for a user', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should display a filled composed field if the user status is not defined', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });
    });

    describe('with cloned field', () => {
        it('should return true if the field is a clone and the value of the clone is not empty', () => {
            const field = {
                name: 'title',
                format: { name: 'fieldClone', args: { value: 'clonedField' } },
            };
            const resource = { title: 'Title', clonedField: 'cloned value' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });

        it('should return false if the field is a clone and the value of the clone is empty', () => {
            const field = {
                name: 'title',
                format: { name: 'fieldClone', args: { value: 'clonedField' } },
            };
            const resource = { title: 'Title', clonedField: '' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(false);
        });

        it('should return true even if the field is a clone and the value of the clone is empty when isAdmin is true', () => {
            const field = {
                name: 'title',
                format: { name: 'fieldClone', args: { value: 'clonedField' } },
            };
            const resource = { title: 'Title', clonedField: '' };
            const fieldStatus = VALIDATED;
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(
                    resource,
                    field,
                    fieldStatus,
                    predicate,
                    isAdmin,
                ),
            ).toBe(true);
        });
    });
});
