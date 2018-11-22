import alphabeticalSort from './alphabeticalSort';

describe('alphabeticalSort', () => {
    it('should sort number', () => {
        expect(
            alphabeticalSort([
                { name: 10 },
                { name: 8 },
                { name: 6 },
                { name: 4 },
                { name: 2 },
                { name: 1 },
                { name: 3 },
                { name: 5 },
                { name: 7 },
                { name: 9 },
            ]),
        ).toEqual([
            { name: 1 },
            { name: 2 },
            { name: 3 },
            { name: 4 },
            { name: 5 },
            { name: 6 },
            { name: 7 },
            { name: 8 },
            { name: 9 },
            { name: 10 },
        ]);
    });
    it('should sort string', () => {
        expect(
            alphabeticalSort([
                { name: 'foo' },
                { name: 'bar' },
                { name: 'baz' },
            ]),
        ).toEqual([{ name: 'bar' }, { name: 'baz' }, { name: 'foo' }]);
    });
    it('should sort string and number', () => {
        expect(
            alphabeticalSort([
                { name: 5 },
                { name: 4 },
                { name: 'Suppl 3' },
                { name: 3 },
                { name: 'Suppl 1' },
                { name: 2 },
                { name: 1 },
            ]),
        ).toEqual([
            { name: 1 },
            { name: 2 },
            { name: 3 },
            { name: 4 },
            { name: 5 },
            { name: 'Suppl 1' },
            { name: 'Suppl 3' },
        ]);
    });
});
