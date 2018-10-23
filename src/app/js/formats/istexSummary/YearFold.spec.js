import React from 'react';
import { shallow } from 'enzyme';

import FetchFold from './FetchFold';
import YearFold from './YearFold';
import { getVolumeData } from './getIstexData';
jest.mock('./getIstexData');

getVolumeData.mockImplementation(() => 'getData');

describe('YearFold', () => {
    const defaultProps = {
        issn: 'issn',
        item: { name: 'year', count: 'count' },
        searchedField: 'searchedField',
        polyglot: v => v,
        children: 'children',
    };

    it('should render FetchFold to fetch Year', () => {
        const wrapper = shallow(<YearFold {...defaultProps} />);

        const fetchFold = wrapper.find(FetchFold);

        expect(fetchFold).toHaveLength(1);
        expect(fetchFold.props()).toEqual({
            label: 'year',
            count: 'count',
            issn: 'issn',
            year: 'year',
            searchedField: 'searchedField',
            getData: 'getData',
            children: 'children',
            polyglot: defaultProps.polyglot,
        });
        expect(getVolumeData).toHaveBeenCalledWith({
            issn: 'issn',
            year: 'year',
            searchedField: 'searchedField',
        });
    });
});
