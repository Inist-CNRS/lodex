import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { TableRowColumn } from 'material-ui/Table';

import { getShortText } from '../../lib/longTexts';
import { ParsingExcerptColumnComponent as ParsingExcerptColumn } from './ParsingExcerptColumn';

describe('<ParsingExcerptColumn />', () => {
    it('should render the value directly when it is short', () => {
        const wrapper = shallow(<ParsingExcerptColumn value="foo" />);
        expect(wrapper.contains(<TableRowColumn>foo</TableRowColumn>)).toEqual(true);
    });

    it('should render the value truncated when it is long', () => {
        const value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
        const wrapper = shallow(<ParsingExcerptColumn value={value} />);
        const row = wrapper.find(TableRowColumn);
        expect(row.prop('title')).toEqual(value);
        expect(row.prop('children')).toEqual(getShortText(value));
    });
});
