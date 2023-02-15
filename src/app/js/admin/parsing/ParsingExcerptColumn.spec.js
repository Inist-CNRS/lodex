import React from 'react';
import { shallow } from 'enzyme';
import { TableCell, CircularProgress } from '@mui/material';

import { getShortText } from '../../lib/longTexts';
import { ParsingExcerptColumnComponent as ParsingExcerptColumn } from './ParsingExcerptColumn';

describe('<ParsingExcerptColumn />', () => {
    it('should render the value directly when it is short', () => {
        const value = 'foo';
        const wrapper = shallow(<ParsingExcerptColumn value={value} />);
        const row = wrapper.find(TableCell);
        expect(row.prop('title')).toEqual(value);
        expect(row.children().text()).toEqual(value);
    });

    it('should render the value truncated when it is long', () => {
        const value =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        const wrapper = shallow(<ParsingExcerptColumn value={value} />);
        const row = wrapper.find(TableCell);
        expect(row.prop('title')).toEqual(value);
        expect(row.children().text()).toEqual(getShortText(value));
    });

    it('should render a loader when it is enrichment loading and value undefined', () => {
        const value = undefined;
        const wrapper = shallow(
            <ParsingExcerptColumn value={value} isEnrichmentLoading={true} />,
        );
        const row = wrapper.find(TableCell);
        expect(row.prop('title')).toEqual(value);
        expect(wrapper.find(CircularProgress).exists()).toBeTruthy();
    });

    it('should render a loader when it is enrichment loading and value defined', () => {
        const value = 'defined';
        const wrapper = shallow(
            <ParsingExcerptColumn value={value} isEnrichmentLoading={true} />,
        );
        const row = wrapper.find(TableCell);
        expect(row.prop('title')).toEqual(value);
        expect(row.children().text()).toEqual(value);
        expect(wrapper.find(CircularProgress).exists()).not.toBeTruthy();
    });
});
