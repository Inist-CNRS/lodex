import { shallow } from 'enzyme';

import FetchFold from './FetchFold';
import VolumeFold from './VolumeFold';
import { getIssueData } from './getIstexData';
jest.mock('./getIstexData');

jest.mock('../../../i18n/I18NContext', () => ({
    useTranslate: () => ({
        translate: (key: string) => key,
    }),
}));

const getData = () => 'data';
// @ts-expect-error TS2339
getIssueData.mockImplementation(() => getData);

describe('VolumeFold', () => {
    const children = () => 'children';
    const defaultProps = {
        value: 'issn',
        year: 'year',
        item: { name: 'volume', count: 1 },
        searchedField: 'host.issn',
        children,
    };

    it('should render FetchFold to fetch Year', () => {
        // @ts-expect-error TS2322
        const wrapper = shallow(<VolumeFold {...defaultProps} />);

        const fetchFold = wrapper.find(FetchFold);

        expect(fetchFold).toHaveLength(1);
        expect(fetchFold.props()).toEqual({
            label: 'volume: volume',
            count: 1,
            volume: 'volume',
            getData,
            children,
            skip: false,
        });
        expect(getIssueData).toHaveBeenCalledWith({
            value: 'issn',
            year: 'year',
            volume: 'volume',
            searchedField: 'host.issn',
        });
    });
});
