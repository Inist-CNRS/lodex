import React from 'react';
import { shallow } from 'enzyme';

import { IstexSummaryView, IstexDocument } from './IstexSummaryView';
import composeRenderProps from '../../lib/composeRenderProps';
import { parseYearData } from './getIstexData';
import IstexList from './IstexList';
import IssueFold from './IssueFold';
import VolumeFold from './VolumeFold';
import YearFold from './YearFold';
import DecadeFold from './DecadeFold';
import InvalidFormat from '../InvalidFormat';
import getDecadeFromData from './getDecadeFromData';

jest.mock('../../lib/composeRenderProps');
jest.mock('./getIstexData');
jest.mock('./getDecadeFromData');

describe('IstexSummaryView', () => {
    const defaultProps = {
        formatData: { hits: [1, 2, 3] },
        field: {
            name: 'field',
        },
        resource: { field: 'value' },
        searchedField: 'searchedField',
        sortDir: 'sortDir',
        p: { t: v => v },
    };
    const renderComposedChild = jest.fn(() => <div>Composed Child</div>);

    beforeAll(() => {
        parseYearData.mockImplementation(v => v);
        composeRenderProps.mockImplementation(() => renderComposedChild);
        getDecadeFromData.mockImplementation(() => 'decade data');
    });

    it('should render Fold for year volume issue and document', () => {
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

        expect(renderComposedChild).toHaveBeenCalledWith({
            data: { hits: [1, 2, 3] },
            issn: 'value',
            searchedField: 'searchedField',
            polyglot: defaultProps.p,
        });
        expect(parseYearData).toHaveBeenCalledWith(
            { hits: [1, 2, 3] },
            'sortDir',
        );
        expect(wrapper.find('div').text()).toEqual('Composed Child');
    });

    it('should render Fold for decade year volume issue and document if formatData.length > 50', () => {
        const wrapper = shallow(
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

        expect(renderComposedChild).toHaveBeenCalledWith({
            data: 'decade data',
            issn: 'value',
            searchedField: 'searchedField',
            polyglot: defaultProps.p,
        });
        expect(parseYearData).toHaveBeenCalledWith(
            { hits: { length: 51 } },
            'sortDir',
        );
        expect(getDecadeFromData).toHaveBeenCalledWith({
            hits: { length: 51 },
        });
        expect(wrapper.find('div').text()).toEqual('Composed Child');
    });

    it('should render InvalidFormat if resource[field.name] is not set', () => {
        const wrapper = shallow(
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
            <IstexSummaryView {...defaultProps} searchedField={null} />,
        );

        expect(composeRenderProps).toHaveBeenCalledTimes(0);
        expect(parseYearData).toHaveBeenCalledTimes(0);
        expect(wrapper.find('div')).toHaveLength(0);
        expect(wrapper.find(InvalidFormat)).toHaveLength(1);
    });

    afterEach(() => {
        parseYearData.mockClear();
        composeRenderProps.mockClear();
        renderComposedChild.mockClear();
    });

    afterAll(() => {
        parseYearData.resetMock();
        composeRenderProps.resetMock();
    });
});
