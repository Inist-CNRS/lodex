import publishedFacetFactory from './publishedFacet';

describe('publishedFacet model', () => {
    const collection = {
        count: jest.fn(),
        find: jest.fn().mockImplementation(() => ({
            skip: () => ({
                limit: () => ({
                    sort: () => ({
                        toArray: () => {},
                    }),
                }),
            }),
        })),
    };
    const listCollections = {
        toArray: () => [true],
    };
    const db = {
        collection: () => collection,
        listCollections: () => listCollections,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findValuesForField', () => {
        describe('without filter', () => {
            it('calls collection.find with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({ field: 'foo' });

                expect(collection.find).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
        describe('with filter', () => {
            it('calls collection.find with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'filter',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: 'f[iìíîïīĭįı][lĺļľłŀ][tţťŧ][eèéêëēĕėęě][rŕŗř]',
                        $options: 'i',
                    },
                });
            });
        });

        describe('with special characters in filter', () => {
            it('finds underscore at the beginning', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: '_',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: '\\_',
                        $options: 'i',
                    },
                });
            });

            it('finds underscore in the middle of text', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'value_',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: 'v[aàáâãäåāăą][lĺļľłŀ][uùúûüūŭůűų][eèéêëēĕėęě]\\_',
                        $options: 'i',
                    },
                });
            });

            it('finds dash in filter', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'value-test',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: 'v[aàáâãäåāăą][lĺļľłŀ][uùúûüūŭůűų][eèéêëēĕėęě]\\-[tţťŧ][eèéêëēĕėęě][sßśŝşš][tţťŧ]',
                        $options: 'i',
                    },
                });
            });

            it('finds slash in filter', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'value/test',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: 'v[aàáâãäåāăą][lĺļľłŀ][uùúûüūŭůűų][eèéêëēĕėęě]\\/[tţťŧ][eèéêëēĕėęě][sßśŝşš][tţťŧ]',
                        $options: 'i',
                    },
                });
            });

            it('finds dot in filter', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'test.value',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: '[tţťŧ][eèéêëēĕėęě][sßśŝşš][tţťŧ]\\.[aàáâãäåāăą][lĺļľłŀ][uùúûüūŭůűų][eèéêëēĕėęě]',
                        $options: 'i',
                    },
                });
            });

            it('escapes regex special characters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'test*value',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: '[tţťŧ][eèéêëēĕėęě][sßśŝşš][tţťŧ]\\*v[aàáâãäåāăą][lĺļľłŀ][uùúûüūŭůűų][eèéêëēĕėęě]',
                        $options: 'i',
                    },
                });
            });
        });

        describe('with multi-word filter', () => {
            it('creates lookahead pattern for multiple words', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'CAN University',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: '^(?=.*[cçćĉċč][aàáâãäåāăą][nñńņňŋ])(?=.*[uùúûüūŭůűų][nñńņňŋ][iìíîïīĭįı]v[eèéêëēĕėęě][rŕŗř][sßśŝşš][iìíîïīĭįı][tţťŧ][yýÿŷ]).*',
                        $options: 'i',
                    },
                });
            });

            it('handles multi-word with special characters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'test_value other-word',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: '^(?=.*[tţťŧ][eèéêëēĕėęě][sßśŝşš][tţťŧ]\\_v[aàáâãäåāăą][lĺļľłŀ][uùúûüūŭůűų][eèéêëēĕėęě])(?=.*[oòóôõöøōŏő][tţťŧ][hĥħ][eèéêëēĕėęě][rŕŗř]\\-[wŵ][oòóôõöøōŏő][rŕŗř][dđď]).*',
                        $options: 'i',
                    },
                });
            });
        });

        describe('with empty or whitespace filter', () => {
            it('ignores empty filter', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: '',
                });

                expect(collection.find).toHaveBeenCalledWith({ field: 'foo' });
            });

            it('ignores whitespace-only filter', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: '   ',
                });

                expect(collection.find).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
    });

    describe('countValuesForField', () => {
        describe('without filter', () => {
            it('calls collection.count with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.countValuesForField('foo');

                expect(collection.count).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
        describe('with filter', () => {
            it('calls collection.count with accent-insensitive regex', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.countValuesForField('foo', 'filter');

                expect(collection.count).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: 'f[iìíîïīĭįı][lĺļľłŀ][tţťŧ][eèéêëēĕėęě][rŕŗř]',
                        $options: 'i',
                    },
                });
            });

            it('handles special characters in count', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.countValuesForField('foo', 'test_value');

                expect(collection.count).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: '[tţťŧ][eèéêëēĕėęě][sßśŝşš][tţťŧ]\\_v[aàáâãäåāăą][lĺļľłŀ][uùúûüūŭůűų][eèéêëēĕėęě]',
                        $options: 'i',
                    },
                });
            });
        });
    });
});
