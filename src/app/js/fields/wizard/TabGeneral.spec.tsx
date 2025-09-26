import React from 'react';
import { shallow } from 'enzyme';
import { TabGeneralComponent as TabGeneral } from './TabGeneral';
import SourceValueToggleConnected from '../sourceValue/SourceValueToggle';

describe('TabGeneral', () => {
    describe('SourceValue', () => {
        const defaultProps = {
            subresourceUri: undefined,
            tranformersLocked: false,
        };

        it('should render TabGeneral with all values when is resource field', () => {
            const wrapper = shallow(<TabGeneral {...defaultProps} />);
            expect(wrapper.find(SourceValueToggleConnected)).toHaveLength(1);
        });
    });
});
