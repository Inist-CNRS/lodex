import shouldDisplayField from './shouldDisplayField';

describe('shouldDisplayField', () => {
    describe('with an empty field', () => {
        it('should display an empty field for an admin', () => {
            const field = { name: 'empty' };
            const resource = {};
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should not display an empty field for a user', () => {
            const field = { name: 'empty' };
            const resource = {};
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(false);
        });

        it('should should not display an empty field if the user status is not defined', () => {
            const field = { name: 'empty' };
            const resource = {};
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(false);
        });
    });

    describe('with a filled simple field', () => {
        it('should display a filled field for an admin', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should display a filled field for a user', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should display a filled field if the user status is not defined', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should not display a filled field for a user if predicate is false', () => {
            const field = { name: 'title' };
            const resource = { title: 'Title' };
            const predicate = () => false;
            const isAdmin = false;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
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
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should not display an empty composed field for a user', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should not display an empty composed field if the user status is not defined', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should display a filled composed field for an admin', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const predicate = () => true;
            const isAdmin = true;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should display a filled composed field for a user', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const predicate = () => true;
            const isAdmin = false;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });

        it('should display a filled composed field if the user status is not defined', () => {
            const field = {
                name: 'title',
                composedOf: { fields: ['something'] },
            };
            const resource = { title: 'salut', something: 'marmelab' };
            const predicate = () => true;
            const isAdmin = undefined;

            expect(
                shouldDisplayField(resource, field, predicate, isAdmin),
            ).toBe(true);
        });
    });
});
