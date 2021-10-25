import React from 'react';
import { shallow } from 'enzyme';
import StepValueValue from './StepValueValue';
import StepValueColumn from './StepValueColumn';
import StepValueConcat from './StepValueConcat';
import StepValueSubresource from './StepValueSubresource';
import StepValueSubresourceField from './StepValueSubresourceField';

import { StepValueComponent as StepValue } from './StepValue';
import StepValueSubresourceColumn from './StepValueSubresourceColumn';

describe('StepValue', () => {
    const defaultProps = {
        isSubresourceField: false,
        handleChange: jest.fn(),
        filter: null,
    };

    it('should render StepValue with all values when is resource field', () => {
        const wrapper = shallow(<StepValue {...defaultProps} />);
        expect(wrapper.find(StepValueValue)).toHaveLength(1);
        expect(wrapper.find(StepValueColumn)).toHaveLength(1);
        expect(wrapper.find(StepValueConcat)).toHaveLength(1);
        expect(wrapper.find(StepValueSubresource)).toHaveLength(1);
        expect(wrapper.find(StepValueSubresourceField)).toHaveLength(1);
    });

    it('should render StepValue with arbitrary and subresource column values when is subresource field', () => {
        const wrapper = shallow(
            <StepValue {...defaultProps} subresourceUri="foo" />,
        );
        console.log(wrapper.debug());
        expect(wrapper.find(StepValueValue)).toHaveLength(1);
        expect(wrapper.find(StepValueSubresourceColumn)).toHaveLength(1);
        expect(wrapper.find(StepValueColumn)).toHaveLength(0);
        expect(wrapper.find(StepValueConcat)).toHaveLength(0);
        expect(wrapper.find(StepValueSubresource)).toHaveLength(0);
        expect(wrapper.find(StepValueSubresourceField)).toHaveLength(0);
    });
});
