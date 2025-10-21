import { shallow } from 'enzyme';

import FetchFold from './FetchFold';
import IssueFold from './IssueFold';
import { getDocumentData } from './getIstexData';
jest.mock('./getIstexData');

const getData = () => 'data';
// @ts-expect-error TS2339
getDocumentData.mockImplementation(() => getData);

describe('IssueFold', () => {
    const children = () => 'children';
    const defaultProps = {
        value: 'value',
        year: 'year',
        volume: 'volume',
        item: { name: 'issue', count: 1 },
        searchedField: 'host.issn',
        // @ts-expect-error TS7006
        polyglot: { t: (v) => v },
        children,
    };

    it('should render FetchFold to fetch Year', () => {
        // @ts-expect-error TS2741
        const wrapper = shallow(<IssueFold {...defaultProps} />);

        const fetchFold = wrapper.find(FetchFold);

        expect(fetchFold).toHaveLength(1);
        expect(fetchFold.props()).toEqual({
            label: 'issue: issue',
            count: 1,
            issue: 'issue',
            getData,
            children,
            polyglot: defaultProps.polyglot,
            skip: false,
        });
        expect(getDocumentData).toHaveBeenCalledWith({
            value: 'value',
            year: 'year',
            volume: 'volume',
            issue: 'issue',
            searchedField: 'host.issn',
        });
    });
});
