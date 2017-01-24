import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { ListItem } from 'material-ui/List';

import { ParsingSummaryComponent as ParsingSummary } from './ParsingSummary';
import ParsingSummaryItem from './ParsingSummaryItem';

describe('<ParsingSummary />', () => {
    it('should render the ListItem for totalLoadedLines', () => {
        const wrapper = shallow(<ParsingSummary
            p={{ t: key => key }}
            totalLoadedLines={24}
        />);
        const line = wrapper.find(ListItem).at(0);
        expect(line.prop('primaryText')).toEqual(<ParsingSummaryItem count={24} label="total lines" />);
    });
});
