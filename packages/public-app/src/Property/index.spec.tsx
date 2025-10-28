import { PropositionStatus, ADMIN_ROLE, USER_ROLE } from '@lodex/common';
import { useCanAnnotate } from '../../../../src/app/js/annotation/useCanAnnotate';
import { PropertyComponent, type PropertyComponentProps } from './index';
import { render } from '../../../../src/test-utils';
import { getPredicate } from '../../../../src/app/js/formats';
// @ts-expect-error TS2322
import { StyleSheetTestUtils } from 'aphrodite';

jest.mock('../../../../src/app/js/annotation/useCanAnnotate');

jest.mock('react-vega');

jest.mock('../../../../src/app/js/formats', () => {
    const originalModule = jest.requireActual('../../formats');
    return {
        __esModule: true,
        ...originalModule,
        getPredicate: jest.fn().mockReturnValue(() => true),
    };
});

jest.mock('../Format', () => ({
    __esModule: true,
    default: () => {
        return <></>;
    },
}));

jest.mock('./CompositeProperty', () => ({
    __esModule: true,
    default: () => {
        return <></>;
    },
}));

jest.mock('./PropertyLinkedFields', () => ({
    __esModule: true,
    default: () => {
        return <></>;
    },
}));

jest.mock('../../../../src/app/js/annotation/CreateAnnotationButton', () => ({
    __esModule: true,
    CreateAnnotationButton: () => <></>,
}));

describe('Property', () => {
    const defaultProps: PropertyComponentProps = {
        className: 'class',
        field: {
            name: 'field',
            label: 'My label',
            format: {
                name: 'text',
                args: {
                    value: 'formatValue',
                },
            },
            scope: 'graph',
        },
        resource: {
            field: 'value',
        },
        parents: [],
    };

    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
        jest.clearAllMocks();
        jest.mocked(getPredicate).mockReturnValue(() => true);
    });

    describe('is admin', () => {
        beforeEach(() => {
            jest.mocked(useCanAnnotate).mockReturnValue(false);
        });
        it('should always render something', () => {
            [null, undefined, '', [], 'value', ['value1', 'value2']].forEach(
                (value) => {
                    const screen = render(
                        <PropertyComponent
                            {...defaultProps}
                            resource={{ field: value }}
                        />,
                        {
                            initialState: {
                                resource: {
                                    resource: {
                                        contributions: [
                                            {
                                                fieldName: 'field',
                                                status: PropositionStatus.VALIDATED,
                                            },
                                        ],
                                    },
                                },
                                user: {
                                    role: ADMIN_ROLE,
                                },
                            },
                        },
                    );
                    expect(
                        screen.getAllByText('My label')[0],
                    ).toBeInTheDocument();
                },
            );
        });
    });

    describe('is not admin', () => {
        beforeEach(() => {
            jest.mocked(useCanAnnotate).mockReturnValue(false);
        });

        it('should render nothing if resource[field.name] is null', () => {
            const screen = render(
                <PropertyComponent
                    {...defaultProps}
                    resource={{ field: null }}
                />,
                {
                    initialState: {
                        resource: {
                            resource: {
                                contributions: [
                                    {
                                        fieldName: 'field',
                                        status: PropositionStatus.VALIDATED,
                                    },
                                ],
                            },
                        },
                        user: {
                            role: USER_ROLE,
                        },
                    },
                },
            );

            expect(screen.queryByText('My Label')).not.toBeInTheDocument();
        });

        it('should render nothing if resource[field.name] is undefined', () => {
            const screen = render(
                <PropertyComponent {...defaultProps} resource={{}} />,
                {
                    initialState: {
                        resource: {
                            resource: {
                                contributions: [
                                    {
                                        fieldName: 'field',
                                        status: PropositionStatus.VALIDATED,
                                    },
                                ],
                            },
                        },
                        user: {
                            role: USER_ROLE,
                        },
                    },
                },
            );

            expect(screen.queryByText('My Label')).not.toBeInTheDocument();
        });

        it('should render nothing if resource[field.name] is an empty string', () => {
            const screen = render(
                <PropertyComponent
                    {...defaultProps}
                    resource={{ field: '' }}
                />,
                {
                    initialState: {
                        resource: {
                            resource: {
                                contributions: [
                                    {
                                        fieldName: 'field',
                                        status: PropositionStatus.VALIDATED,
                                    },
                                ],
                            },
                        },
                        user: {
                            role: USER_ROLE,
                        },
                    },
                },
            );

            expect(screen.queryByText('My Label')).not.toBeInTheDocument();
        });

        it('should render nothing if resource[field.name] is an empty array', () => {
            const screen = render(
                <PropertyComponent
                    {...defaultProps}
                    resource={{ field: [] }}
                />,
                {
                    initialState: {
                        resource: {
                            resource: {
                                contributions: [
                                    {
                                        fieldName: 'field',
                                        status: PropositionStatus.VALIDATED,
                                    },
                                ],
                            },
                        },
                        user: {
                            role: USER_ROLE,
                        },
                    },
                },
            );

            expect(screen.queryByText('My Label')).not.toBeInTheDocument();
        });

        it('should render nothing if fieldStatus is rejected', () => {
            const screen = render(<PropertyComponent {...defaultProps} />, {
                initialState: {
                    resource: {
                        resource: {
                            contributions: [
                                {
                                    fieldName: 'field',
                                    status: PropositionStatus.REJECTED,
                                },
                            ],
                        },
                    },
                    user: {
                        role: USER_ROLE,
                    },
                },
            });

            expect(screen.queryByText('My Label')).not.toBeInTheDocument();
        });

        it('should render nothing if predicate is false', () => {
            (getPredicate as jest.Mock).mockReturnValue(() => false);
            const screen = render(<PropertyComponent {...defaultProps} />, {
                initialState: {
                    resource: {
                        resource: {
                            contributions: [
                                {
                                    fieldName: 'field',
                                    status: PropositionStatus.VALIDATED,
                                },
                            ],
                        },
                    },
                    user: {
                        role: USER_ROLE,
                    },
                },
            });

            expect(screen.queryByText('My Label')).not.toBeInTheDocument();
        });

        it('should render something if resource[field.name] is a value', () => {
            const screen = render(
                <PropertyComponent
                    {...defaultProps}
                    resource={{ field: 'value' }}
                />,
                {
                    initialState: {
                        resource: {
                            resource: {
                                contributions: [
                                    {
                                        fieldName: 'field',
                                        status: PropositionStatus.VALIDATED,
                                    },
                                ],
                            },
                        },
                        user: {
                            role: USER_ROLE,
                        },
                    },
                },
            );

            expect(screen.getByText('My label')).toBeInTheDocument();
        });

        it('should render something if resource[field.name] and field format is list is a list of value', () => {
            const screen = render(
                <PropertyComponent
                    {...defaultProps}
                    isAdmin={false}
                    field={{
                        name: 'field',
                        label: 'My label with list',
                        // @ts-expect-error TS2322
                        format: {
                            name: 'list',
                        },
                    }}
                    resource={{ field: ['value1', 'value2'] }}
                />,
                {
                    initialState: {
                        resource: {
                            resource: {
                                contributions: [
                                    {
                                        fieldName: 'field',
                                        status: PropositionStatus.VALIDATED,
                                    },
                                ],
                            },
                        },
                        user: {
                            role: USER_ROLE,
                        },
                    },
                },
            );

            expect(screen.getByText('My label with list')).toBeInTheDocument();
        });
    });

    describe('can annotate', () => {
        beforeEach(() => {
            jest.mocked(useCanAnnotate).mockReturnValue(true);
        });
        it('should always render something value', () => {
            [null, undefined, '', [], 'value', ['value1', 'value2']].forEach(
                (value) => {
                    const screen = render(
                        <PropertyComponent
                            {...defaultProps}
                            resource={{ field: value }}
                        />,
                        {
                            initialState: {
                                resource: {
                                    resource: {
                                        contributions: [
                                            {
                                                fieldName: 'field',
                                                status: PropositionStatus.VALIDATED,
                                            },
                                        ],
                                    },
                                },
                                user: {
                                    role: USER_ROLE,
                                },
                            },
                        },
                    );
                    expect(
                        screen.getAllByText('My label')[0],
                    ).toBeInTheDocument();
                },
            );
        });
    });
});
