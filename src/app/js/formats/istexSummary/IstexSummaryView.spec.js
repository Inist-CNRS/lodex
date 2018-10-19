import React from 'react';
import { shallow } from 'enzyme';

import { IstexSummaryView, FoldList, IstexDocument } from './IstexSummaryView';
import composeRenderProps from '../../lib/composeRenderProps';
import { parseYearData, getDecadeData } from './getIstexData';
import IssueFold from './IssueFold';
import VolumeFold from './VolumeFold';
import YearFold from './YearFold';
import FetchIstex from './FetchIstex';
import DecadeFold from './DecadeFold';
import InvalidFormat from '../InvalidFormat';

jest.mock('../../lib/composeRenderProps');
jest.mock('./getIstexData');

describe('IstexSummaryView', () => {
    const defaultProps = {
        formatData: [1, 2, 3],
        field: {
            name: 'field',
        },
        resource: { field: 'value' },
        searchedField: 'searchedField',
        p: { t: v => v },
    };

    beforeAll(() => {
        parseYearData.mockImplementation(v => v);
        composeRenderProps.mockImplementation(() => <div>Composed Child</div>);
    });

    it('should render Fold for year volume issue and document', () => {
        const wrapper = shallow(<IstexSummaryView {...defaultProps} />);

        expect(composeRenderProps).toBeCalledWith(
            <FoldList
                data={[1, 2, 3]}
                issn={'value'}
                searchedField={'searchedField'}
                polyglot={defaultProps.p}
            />,
            [
                YearFold,
                FoldList,
                VolumeFold,
                FoldList,
                IssueFold,
                FoldList,
                IstexDocument,
            ],
        );
        expect(parseYearData).toHaveBeenCalledWith([1, 2, 3]);
        expect(wrapper.find('div').text()).toEqual('Composed Child');
    });

    it('should render Fold for decade year volume issue and document if formatData.length > 50', () => {
        const wrapper = shallow(
            <IstexSummaryView {...defaultProps} formatData={{ length: 51 }} />,
        );

        expect(composeRenderProps).toBeCalledWith(
            <FetchIstex
                data={{ length: 51 }}
                issn={'value'}
                searchedField={'searchedField'}
                getData={getDecadeData({
                    issn: 'value',
                    searchedField: 'searchedField',
                })}
                polyglot={defaultProps.p}
            />,
            [
                FoldList,
                DecadeFold,
                FoldList,
                YearFold,
                FoldList,
                VolumeFold,
                FoldList,
                IssueFold,
                FoldList,
                IstexDocument,
            ],
        );
        expect(parseYearData).toHaveBeenCalledWith({ length: 51 });
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
    });

    afterAll(() => {
        parseYearData.resetMock();
        composeRenderProps.resetMock();
    });
});
