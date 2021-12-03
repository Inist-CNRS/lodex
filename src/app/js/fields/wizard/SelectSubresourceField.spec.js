import { mapStateToProps } from './SelectSubresourceField';

describe('SelectSubresourceField', () => {
    describe('datasetFields from mapStateToProps', () => {
        it('should return dataset fields from subresourceUri', () => {
            const state = {
                subresource: {
                    subresources: [{ _id: 'foo', path: 'columnPath' }],
                },
                parsing: {
                    excerptLines: [{ columnPath: '{"cov": "fefe"}' }],
                },
                polyglot: { phrases: { other: 'Other' } },
            };

            expect(mapStateToProps(state, { subresourceUri: 'foo' })).toEqual({
                datasetFields: ['cov', 'Other'],
            });
        });

        it('should return dataset fields from subresourceUri with array of objects too', () => {
            const state = {
                subresource: {
                    subresources: [{ _id: 'foo', path: 'columnPath' }],
                },
                parsing: {
                    excerptLines: [
                        { columnPath: '[{"bar": "bade"}, {"cov": "fefe"}]' },
                    ],
                },
                polyglot: { phrases: { other: 'Other' } },
            };

            expect(mapStateToProps(state, { subresourceUri: 'foo' })).toEqual({
                datasetFields: ['bar', 'Other'],
            });
        });
    });
});
