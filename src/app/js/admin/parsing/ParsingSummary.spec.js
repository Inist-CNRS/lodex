import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import { ListItem } from 'material-ui/List';
import { red400 } from 'material-ui/styles/colors';

import { ParsingSummaryComponent as ParsingSummary } from './ParsingSummary';
import ParsingSummaryItem from './ParsingSummaryItem';

describe('<ParsingSummary />', () => {
    it('should render the ListItem for totalLoadedLines', () => {
        const wrapper = shallow(<ParsingSummary
            p={{ t: key => key }}
            totalFailedLines={42}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);
        const line = wrapper.find(ListItem).at(0);
        expect(line.prop('primaryText')).toEqual(<ParsingSummaryItem count={24} label="total lines" />);
    });

    it('should render the ListItem for totalParsedLines', () => {
        const wrapper = shallow(<ParsingSummary
            p={{ t: key => key }}
            totalFailedLines={42}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);
        const line = wrapper.find(ListItem).at(1);
        expect(line.prop('primaryText')).toEqual(<ParsingSummaryItem count={100} label="successfully parsed" />);
    });

    it('should render the ListItem for totalFailedLines', () => {
        const wrapper = shallow(<ParsingSummary
            p={{ t: key => key }}
            totalFailedLines={42}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);
        const line = wrapper.find(ListItem).at(2);
        expect(line.prop('primaryText'))
            .toEqual(<ParsingSummaryItem color={red400} count={42} label="with errors" />);
    });

    it('should call onShowErrors when totalFailedLines is clicked', () => {
        const onShowErrors = createSpy();

        const wrapper = shallow(<ParsingSummary
            onShowErrors={onShowErrors}
            p={{ t: key => key }}
            totalFailedLines={42}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);
        wrapper.find(ListItem).at(2).simulate('click');

        expect(onShowErrors).toHaveBeenCalled();
    });

    it('should call onShowErrors when totalParsedLines is clicked', () => {
        const onShowExcerpt = createSpy();

        const wrapper = shallow(<ParsingSummary
            onShowExcerpt={onShowExcerpt}
            p={{ t: key => key }}
            totalFailedLines={42}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);
        wrapper.find(ListItem).at(1).simulate('click');

        expect(onShowExcerpt).toHaveBeenCalled();
    });
});
