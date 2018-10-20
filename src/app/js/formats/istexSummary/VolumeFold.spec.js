import React from 'react';
import { shallow } from 'enzyme';

import FetchFold from './FetchFold';
import VolumeFold from './VolumeFold';
import { getIssueData } from './getIstexData';
jest.mock('./getIstexData');

getIssueData.mockImplementation(() => 'getData');

describe('VolumeFold', () => {
    const defaultProps = {
        issn: 'issn',
        year: 'year',
        item: { name: 'volume', count: 'count' },
        searchedField: 'searchedField',
        polyglot: { t: v => v },
        children: 'children',
    };

    it('should render FetchFold to fetch Year', () => {
        const wrapper = shallow(<VolumeFold {...defaultProps} />);

        const fetchFold = wrapper.find(FetchFold);

        expect(fetchFold).toHaveLength(1);
        expect(fetchFold.props()).toEqual({
            label: 'volume: volume',
            count: 'count',
            volume: 'volume',
            getData: 'getData',
            children: 'children',
            polyglot: defaultProps.polyglot,
        });
        expect(getIssueData).toHaveBeenCalledWith({
            issn: 'issn',
            year: 'year',
            volume: 'volume',
            searchedField: 'searchedField',
        });
    });
});
