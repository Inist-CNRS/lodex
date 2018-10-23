import React from 'react';
import { shallow } from 'enzyme';

import FetchFold from './FetchFold';
import IssueFold from './IssueFold';
import { getDocumentData } from './getIstexData';
jest.mock('./getIstexData');

getDocumentData.mockImplementation(() => 'getData');

describe('IssueFold', () => {
    const defaultProps = {
        issn: 'issn',
        year: 'year',
        volume: 'volume',
        item: { name: 'issue', count: 'count' },
        searchedField: 'searchedField',
        polyglot: { t: v => v },
        children: 'children',
    };

    it('should render FetchFold to fetch Year', () => {
        const wrapper = shallow(<IssueFold {...defaultProps} />);

        const fetchFold = wrapper.find(FetchFold);

        expect(fetchFold).toHaveLength(1);
        expect(fetchFold.props()).toEqual({
            label: 'issue: issue',
            count: 'count',
            issn: 'issn',
            year: 'year',
            volume: 'volume',
            issue: 'issue',
            searchedField: 'searchedField',
            getData: 'getData',
            children: 'children',
            polyglot: defaultProps.polyglot,
        });
        expect(getDocumentData).toHaveBeenCalledWith({
            issn: 'issn',
            year: 'year',
            volume: 'volume',
            issue: 'issue',
            searchedField: 'searchedField',
        });
    });
});
