import React from 'react';
import { shallow } from 'enzyme';
import TabValueValue from './TabValueValue';
import TabValueColumn from './TabValueColumn';
import TabValueConcat from './TabValueConcat';
import TabValueSubresource from './TabValueSubresource';
import TabValueSubresourceField from './TabValueSubresourceField';

import { TabValueComponent as TabValue } from './TabValue';
import TabValueSubresourceColumn from './TabValueSubresourceColumn';

describe('TabValue', () => {
    const defaultProps = {
        isSubresourceField: false,
        handleChange: jest.fn(),
        filter: null,
    };

    it('should render TabValue with all values when is resource field', () => {
        const wrapper = shallow(<TabValue {...defaultProps} />);
        expect(wrapper.find(TabValueValue)).toHaveLength(1);
        expect(wrapper.find(TabValueColumn)).toHaveLength(1);
        expect(wrapper.find(TabValueConcat)).toHaveLength(1);
        expect(wrapper.find(TabValueSubresource)).toHaveLength(1);
        expect(wrapper.find(TabValueSubresourceField)).toHaveLength(1);
    });

    it('should render TabValue with arbitrary and subresource column values when is subresource field', () => {
        const wrapper = shallow(
            <TabValue {...defaultProps} subresourceUri="foo" />,
        );

        expect(wrapper.find(TabValueValue)).toHaveLength(1);
        expect(wrapper.find(TabValueSubresourceColumn)).toHaveLength(1);
        expect(wrapper.find(TabValueColumn)).toHaveLength(0);
        expect(wrapper.find(TabValueConcat)).toHaveLength(0);
        expect(wrapper.find(TabValueSubresource)).toHaveLength(0);
        expect(wrapper.find(TabValueSubresourceField)).toHaveLength(0);
    });
});
