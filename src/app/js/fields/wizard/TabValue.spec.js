import React from 'react';
import { shallow } from 'enzyme';

import { TabValueComponent as TabValue } from './TabValue';
import SourceValueToggleConnected from '../sourceValue/SourceValueToggle';

describe('TabValue', () => {
    const defaultProps = {
        isSubresourceField: false,
        handleChange: jest.fn(),
        filter: null,
    };

    it('should render TabValue with all values when is resource field', () => {
        const wrapper = shallow(<TabValue {...defaultProps} />);
        expect(wrapper.find(SourceValueToggleConnected)).toHaveLength(1);
    });
});
