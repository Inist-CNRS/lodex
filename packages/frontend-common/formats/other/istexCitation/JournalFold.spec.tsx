import { shallow } from 'enzyme';

import FetchFold from '../istexSummary/FetchFold';
import JournalFold from './JournalFold';
import { getCitationDocumentData } from './getIstexCitationData';
import { CUSTOM_ISTEX_QUERY } from '../istexSummary/constants';

jest.mock('./getIstexCitationData');

const getData = () => 'data';
// @ts-expect-error TS2339
getCitationDocumentData.mockImplementation(() => getData);

describe('JournalFold', () => {
    const children = () => 'children';
    const defaultProps = {
        value: 'refBibs.host.title:"The Lancet"',
        item: { name: 'The Lancet', count: 9908 },
        searchedField: CUSTOM_ISTEX_QUERY,
        documentSortBy: 'publicationDate[desc]',
        children,
    };

    it('should render FetchFold to fetch Journal name', () => {
        const wrapper = shallow(<JournalFold {...defaultProps} />);

        const fetchFold = wrapper.find(FetchFold);

        expect(fetchFold).toHaveLength(1);
        expect(fetchFold.props()).toEqual({
            label: 'The Lancet',
            count: 9908,
            name: 'The Lancet',
            getData,
            children,
            skip: false,
        });
        expect(getCitationDocumentData).toHaveBeenCalledWith({
            value: 'refBibs.host.title:"The Lancet"',
            name: 'The Lancet',
            searchedField: CUSTOM_ISTEX_QUERY,
            documentSortBy: 'publicationDate[desc]',
        });
    });
});
