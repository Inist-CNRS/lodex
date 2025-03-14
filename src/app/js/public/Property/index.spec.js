import { shallow } from 'enzyme';
import React from 'react';

import { REJECTED, VALIDATED } from '../../../../common/propositionStatus';
import { useCanAnnotate } from '../../annotation/useCanAnnotate';
import { PropertyComponent } from './index';

jest.mock('../../annotation/useCanAnnotate');

describe('Property', () => {
    const defaultProps = {
        className: 'class',
        field: { name: 'field' },
        resource: {
            field: 'value',
        },
        fieldStatus: VALIDATED,
        isAdmin: true,
        changeStatus: () => null,
        parents: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('is not admin', () => {
        beforeEach(() => {
            jest.mocked(useCanAnnotate).mockReturnValue(false);
        });

        it('should render nothing if resource[field.name] is null', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    isAdmin={false}
                    resource={{ field: null }}
                />,
            );

            expect(wrapper.getElement()).toBeNull();
        });

        it('should render nothing if resource[field.name] is undefined', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    isAdmin={false}
                    resource={{}}
                />,
            );

            expect(wrapper.getElement()).toBeNull();
        });

        it('should render nothing if resource[field.name] is an empty string', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    isAdmin={false}
                    resource={{ field: '' }}
                />,
            );

            expect(wrapper.getElement()).toBeNull();
        });

        it('should render nothing if resource[field.name] is an empty array', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    isAdmin={false}
                    resource={{ field: [] }}
                />,
            );

            expect(wrapper.getElement()).toBeNull();
        });

        it('should render nothing if fieldStatus is rejected', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    fieldStatus={REJECTED}
                    isAdmin={false}
                />,
            );

            expect(wrapper.getElement()).toBeNull();
        });

        it('should render nothing if predicate is false', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    predicate={() => false}
                    isAdmin={false}
                />,
            );

            expect(wrapper.getElement()).toBeNull();
        });

        it('should render something if resource[field.name] is a value', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    isAdmin={false}
                    resource={{ field: 'value' }}
                />,
            );

            expect(wrapper.getElement()).not.toBeNull();
        });

        it('should render something if resource[field.name] and field format is list is a list of value', () => {
            const wrapper = shallow(
                <PropertyComponent
                    {...defaultProps}
                    isAdmin={false}
                    field={{
                        name: 'field',
                        format: {
                            name: 'list',
                        },
                    }}
                    resource={{ field: ['value1', 'value2'] }}
                />,
            );

            expect(wrapper.getElement()).not.toBeNull();
        });
    });

    describe('is admin', () => {
        beforeEach(() => {
            jest.mocked(useCanAnnotate).mockReturnValue(false);
        });

        it('should always render something', () => {
            [null, undefined, '', [], 'value', ['value1', 'value2']].forEach(
                (value) => {
                    const wrapper = shallow(
                        <PropertyComponent
                            {...defaultProps}
                            p={{ t: (x) => x }}
                            isAdmin={true}
                            resource={{ field: value }}
                        />,
                    );

                    expect(wrapper.getElement()).not.toBeNull();
                },
            );
        });
    });

    describe('can annotate', () => {
        beforeEach(() => {
            jest.mocked(useCanAnnotate).mockReturnValue(true);
        });

        it('should always render something', () => {
            [null, undefined, '', [], 'value', ['value1', 'value2']].forEach(
                (value) => {
                    const wrapper = shallow(
                        <PropertyComponent
                            {...defaultProps}
                            p={{ t: (x) => x }}
                            isAdmin={false}
                            resource={{ field: value }}
                        />,
                    );

                    expect(wrapper.getElement()).not.toBeNull();
                },
            );
        });
    });
});
