import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { grey500, grey800, red400 } from 'material-ui/styles/colors';

import ParsingSummaryItem from './ParsingSummaryItem';

describe('<ParsingSummaryItem />', () => {
    it('should render the count', () => {
        const wrapper = shallow(<ParsingSummaryItem count={10} label="foo" />);
        expect(wrapper.contains(<b style={{ color: grey800 }}>{10}</b>)).toEqual(true);
    });

    it('should render the count with specified color', () => {
        const wrapper = shallow(<ParsingSummaryItem count={10} label="foo" color={red400} />);
        expect(wrapper.contains(<b style={{ color: red400 }}>{10}</b>)).toEqual(true);
    });

    it('should render the count', () => {
        const wrapper = shallow(<ParsingSummaryItem count={10} label="foo" />);
        expect(wrapper.contains(<small style={{ color: grey500 }}>foo</small>)).toEqual(true);
    });

    it('should render the count with specified color', () => {
        const wrapper = shallow(<ParsingSummaryItem count={10} label="foo" color={red400} />);
        expect(wrapper.contains(<small style={{ color: red400 }}>foo</small>)).toEqual(true);
    });
});
