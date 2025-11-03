// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';
import { shallow } from 'enzyme';

import composeRenderProps from '@lodex/frontend-common/utils/composeRenderProps';
import InvalidFormat from '../../InvalidFormat';
import { CUSTOM_ISTEX_QUERY } from '../istexSummary/constants';
import { parseCitationData } from './getIstexCitationData';
import IstexCitationList from './IstexCitationList';
import { IstexCitationView, IstexDocument } from './IstexCitationView';
import JournalFold from './JournalFold';

jest.mock('../../../lib/composeRenderProps');
jest.mock('./getIstexCitationData');

describe('IstexCitationView', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    const defaultProps = {
        formatData: { hits: [1, 2, 3] },
        field: {
            name: 'field',
        },
        resource: { uri: 'uri', field: 'refBibs.host.title:"The Lancet"' },
        searchedField: CUSTOM_ISTEX_QUERY,
        documentSortBy: 'publicationDate[desc]',
    };
    const ComposedComponent = () => <div>Composed Child</div>;

    beforeAll(() => {
        // @ts-expect-error TS2339
        parseCitationData.mockImplementation((v) => v);
        // @ts-expect-error TS2339
        composeRenderProps.mockImplementation(() => ComposedComponent);
    });

    it('should render Fold for journal and document', () => {
        // @ts-expect-error TS2322
        const wrapper = shallow(<IstexCitationView {...defaultProps} />);

        expect(composeRenderProps).toHaveBeenCalledWith([
            IstexCitationList,
            JournalFold,
            IstexCitationList,
            IstexDocument,
        ]);

        expect(wrapper.find(ComposedComponent).props()).toEqual({
            data: { hits: [1, 2, 3] },
            value: 'refBibs.host.title:"The Lancet"',
            searchedField: CUSTOM_ISTEX_QUERY,
            documentSortBy: 'publicationDate[desc]',
        });
        expect(parseCitationData).toHaveBeenCalledWith({ hits: [1, 2, 3] });
    });

    it('should render InvalidFormat if resource[field.name] is not set', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <IstexCitationView
                {...defaultProps}
                resource={{ fieldName: null }}
            />,
        );

        expect(composeRenderProps).toHaveBeenCalledTimes(0);
        expect(parseCitationData).toHaveBeenCalledTimes(0);
        expect(wrapper.find('div')).toHaveLength(0);
        expect(wrapper.find(InvalidFormat)).toHaveLength(1);
    });

    it('should render InvalidFormat if searchedField is not set', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <IstexCitationView {...defaultProps} searchedField={null} />,
        );

        expect(composeRenderProps).toHaveBeenCalledTimes(0);
        expect(parseCitationData).toHaveBeenCalledTimes(0);
        expect(wrapper.find('div')).toHaveLength(0);
        expect(wrapper.find(InvalidFormat)).toHaveLength(1);
    });

    afterEach(() => {
        // @ts-expect-error TS2339
        parseCitationData.mockClear();
        // @ts-expect-error TS2339
        composeRenderProps.mockClear();
        StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
});
