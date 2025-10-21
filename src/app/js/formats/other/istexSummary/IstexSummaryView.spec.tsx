// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';
import { shallow } from 'enzyme';

import composeRenderProps from '../../../lib/composeRenderProps';
import InvalidFormat from '../../InvalidFormat';
import DecadeFold from './DecadeFold';
import getDecadeFromData from './getDecadeFromData';
import { parseYearData } from './getIstexData';
import IssueFold from './IssueFold';
import IstexList from './IstexList';
import { IstexDocument, IstexSummaryView } from './IstexSummaryView';
import VolumeFold from './VolumeFold';
import YearFold from './YearFold';

jest.mock('../../../lib/composeRenderProps');
jest.mock('./getIstexData');
jest.mock('./getDecadeFromData');

describe('IstexSummaryView', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    const defaultProps = {
        formatData: { hits: [1, 2, 3] },
        field: {
            name: 'field',
        },
        resource: { uri: 'uri', field: 'value' },
        searchedField: 'host.issn',
        sortDir: 'sortDir',
        yearThreshold: 50,
        // @ts-expect-error TS7006
        p: { t: (v) => v },
    };
    const ComposedComponent = () => <div>Composed Child</div>;

    beforeAll(() => {
        // @ts-expect-error TS2339
        parseYearData.mockImplementation((v) => v);
        // @ts-expect-error TS2339
        composeRenderProps.mockImplementation(() => ComposedComponent);
        // @ts-expect-error TS2339
        getDecadeFromData.mockImplementation(() => 'decade data');
    });

    it('should render Fold for year volume issue and document', () => {
        // @ts-expect-error TS2741
        const wrapper = shallow(<IstexSummaryView {...defaultProps} />);

        expect(composeRenderProps).toHaveBeenCalledWith([
            IstexList,
            YearFold,
            IstexList,
            VolumeFold,
            IstexList,
            IssueFold,
            IstexList,
            IstexDocument,
        ]);

        expect(wrapper.find(ComposedComponent).props()).toEqual({
            data: { hits: [1, 2, 3] },
            value: 'value',
            searchedField: 'host.issn',
            sortDir: 'sortDir',
            polyglot: defaultProps.p,
        });
        expect(parseYearData).toHaveBeenCalledWith(
            { hits: [1, 2, 3] },
            'sortDir',
        );
    });

    it('should render Fold for decade year volume issue and document if formatData.length > 50', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2741
            <IstexSummaryView
                {...defaultProps}
                formatData={{ hits: { length: 51 } }}
            />,
        );

        expect(composeRenderProps).toHaveBeenCalledWith([
            IstexList,
            DecadeFold,
            IstexList,
            YearFold,
            IstexList,
            VolumeFold,
            IstexList,
            IssueFold,
            IstexList,
            IstexDocument,
        ]);

        expect(wrapper.find(ComposedComponent).props()).toEqual({
            data: 'decade data',
            value: 'value',
            searchedField: 'host.issn',
            sortDir: 'sortDir',
            polyglot: defaultProps.p,
        });
        expect(parseYearData).toHaveBeenCalledWith(
            { hits: { length: 51 } },
            'sortDir',
        );
        expect(getDecadeFromData).toHaveBeenCalledWith(
            {
                hits: { length: 51 },
            },
            false,
        );
    });

    it('should render InvalidFormat if resource[field.name] is not set', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2741
            <IstexSummaryView
                {...defaultProps}
                resource={{ fieldName: null }}
            />,
        );

        expect(composeRenderProps).toHaveBeenCalledTimes(0);
        expect(parseYearData).toHaveBeenCalledTimes(0);
        expect(wrapper.find('div')).toHaveLength(0);
        expect(wrapper.find(InvalidFormat)).toHaveLength(1);
    });

    it('should render InvalidFormat if searchedField is not set', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2741
            <IstexSummaryView {...defaultProps} searchedField={null} />,
        );

        expect(composeRenderProps).toHaveBeenCalledTimes(0);
        expect(parseYearData).toHaveBeenCalledTimes(0);
        expect(wrapper.find('div')).toHaveLength(0);
        expect(wrapper.find(InvalidFormat)).toHaveLength(1);
    });

    afterEach(() => {
        // @ts-expect-error TS2339
        parseYearData.mockClear();
        // @ts-expect-error TS2339
        composeRenderProps.mockClear();
        StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
});
