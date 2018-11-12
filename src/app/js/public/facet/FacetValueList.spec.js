import React from 'react';
import { shallow } from 'enzyme';
import FlatButton from 'material-ui/FlatButton';
import CheckBox from 'material-ui/Checkbox';

import { FacetValueList } from './FacetValueList';
import SortButton from '../../lib/components/SortButton';

describe('FacetValueList', () => {
    const defaultProps = {
        name: 'facet',
        label: 'my facet',
        facetValues: [],
        total: 51,
        currentPage: '1',
        perPage: 10,
        filter: null,
        inverted: false,
        sort: {
            sortDir: 'DESC',
            sortBy: 'count',
        },
        p: {
            t: v => v,
        },
        page: 'dataset',
        changeFacetValue: jest.fn(),
        invertFacet: jest.fn(),
        sortFacetValue: jest.fn(),
    };

    beforeEach(() => {
        defaultProps.changeFacetValue.mockClear();
        defaultProps.invertFacet.mockClear();
        defaultProps.sortFacetValue.mockClear();
    });

    it('should allow to sort', () => {
        const wrapper = shallow(<FacetValueList {...defaultProps} />);

        const sortButtons = wrapper.find(SortButton);

        expect(sortButtons).toHaveLength(2);

        sortButtons
            .at(0)
            .dive()
            .dive()
            .find(FlatButton)
            .simulate('click');

        expect(defaultProps.sortFacetValue).toBeCalledTimes(1);

        expect(defaultProps.sortFacetValue).toHaveBeenCalledWith({
            name: 'facet',
            nextSortBy: 'value',
        });

        sortButtons
            .at(1)
            .dive()
            .dive()
            .find(FlatButton)
            .simulate('click');

        expect(defaultProps.sortFacetValue).toBeCalledTimes(2);

        expect(defaultProps.sortFacetValue).toHaveBeenCalledWith({
            name: 'facet',
            nextSortBy: 'count',
        });
    });
});
