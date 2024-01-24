import React from 'react';
import { shallow } from 'enzyme';

import FetchFold from './FetchFold';
import YearFold from './YearFold';
import { getVolumeData } from './getIstexData';
jest.mock('./getIstexData');

const getData = () => 'data';
getVolumeData.mockImplementation(() => getData);

describe('YearFold', () => {
    const children = () => 'children';
    const defaultProps = {
        value: 'value',
        item: { name: 'year', count: 1 },
        searchedField: 'host.issn',
        polyglot: { t: v => v },
        children,
    };

    it('should render FetchFold to fetch Year', () => {
        const wrapper = shallow(<YearFold {...defaultProps} />);

        const fetchFold = wrapper.find(FetchFold);

        expect(fetchFold).toHaveLength(1);
        expect(fetchFold.props()).toEqual({
            label: 'year',
            count: 1,
            year: 'year',
            getData,
            children,
            polyglot: defaultProps.polyglot,
        });
        expect(getVolumeData).toHaveBeenCalledWith({
            value: 'value',
            year: 'year',
            searchedField: 'host.issn',
        });
    });
});
