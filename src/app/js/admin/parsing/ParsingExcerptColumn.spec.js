import React from 'react';
import { shallow } from 'enzyme';
import { TableRowColumn } from 'material-ui/Table';

import { getShortText } from '../../lib/longTexts';
import { ParsingExcerptColumnComponent as ParsingExcerptColumn } from './ParsingExcerptColumn';

describe('<ParsingExcerptColumn />', () => {
    it('should render the value directly when it is short', () => {
        const value = 'foo';
        const wrapper = shallow(<ParsingExcerptColumn value={value} />);
        const row = wrapper.find(TableRowColumn);
        expect(row.prop('title')).toEqual(undefined);
        expect(row.children().text()).toEqual(value);
    });

    it('should render the value truncated when it is long', () => {
        const value =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        const wrapper = shallow(<ParsingExcerptColumn value={value} />);
        const row = wrapper.find(TableRowColumn);
        expect(row.prop('title')).toEqual(value);
        expect(row.children().text()).toEqual(getShortText(value));
    });
});
