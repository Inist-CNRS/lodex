import { mapStateToProps } from './TabValueSubresourceColumn';

describe('TabValueSubresourceColumn', () => {
    describe('mapStateToProps', () => {
        it('should return an empty state for an unknown subresource', () => {
            expect(
                mapStateToProps(
                    {
                        subresource: {
                            subresources: [{ _id: 'bar', path: 'subPath' }],
                        },
                    },
                    { subresourceUri: 'foo' },
                ),
            ).toEqual({ selected: false, column: null, subresourcePath: null });
        });

        it('should return the right props from subresourceUri', () => {
            expect(
                mapStateToProps(
                    {
                        subresource: {
                            subresources: [{ _id: 'bar', path: 'subPath' }],
                        },
                        form: {
                            field: {
                                values: {
                                    transformers: [
                                        {
                                            operation: 'COLUMN',
                                            args: [
                                                {
                                                    name: 'column',
                                                    type: 'column',
                                                    value:
                                                        'Detected species names',
                                                },
                                            ],
                                        },
                                        {
                                            operation: 'PARSE',
                                        },
                                        {
                                            operation: 'GET',
                                            args: [
                                                {
                                                    name: 'path',
                                                    type: 'string',
                                                    value: 'Classification',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    { subresourceUri: 'bar' },
                ),
            ).toEqual({
                selected: true,
                column: 'Classification',
                subresourcePath: 'subPath',
            });
        });

        it('should return the empty props with subresource path if GET transformer is not defined yet', () => {
            expect(
                mapStateToProps(
                    {
                        subresource: {
                            subresources: [{ _id: 'bar', path: 'subPath' }],
                        },
                        form: {
                            field: {
                                values: {
                                    transformers: [],
                                },
                            },
                        },
                    },
                    { subresourceUri: 'bar' },
                ),
            ).toEqual({
                selected: false,
                column: null,
                subresourcePath: 'subPath',
            });
        });
    });
});
