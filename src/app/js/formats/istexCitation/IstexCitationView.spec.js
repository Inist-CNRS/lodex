import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import { IstexCitationView, IstexDocument } from './IstexCitationView';
import composeRenderProps from '../../lib/composeRenderProps';
import { parseCitationData } from './getIstexCitationData';
import IstexCitationList from '../istexCitation/IstexCitationList';
import JournalFold from './JournalFold';
import InvalidFormat from '../InvalidFormat';
import { CUSTOM_ISTEX_QUERY } from '../istexSummary/constants';

jest.mock('../../lib/composeRenderProps');
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
        p: { t: v => v },
    };
    const ComposedComponent = () => <div>Composed Child</div>;

    beforeAll(() => {
        parseCitationData.mockImplementation(v => v);
        composeRenderProps.mockImplementation(() => ComposedComponent);
    });

    it('should render Fold for journal and document', () => {
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
            polyglot: defaultProps.p,
        });
        expect(parseCitationData).toHaveBeenCalledWith({ hits: [1, 2, 3] });
    });

    it('should render InvalidFormat if resource[field.name] is not set', () => {
        const wrapper = shallow(
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
            <IstexCitationView {...defaultProps} searchedField={null} />,
        );

        expect(composeRenderProps).toHaveBeenCalledTimes(0);
        expect(parseCitationData).toHaveBeenCalledTimes(0);
        expect(wrapper.find('div')).toHaveLength(0);
        expect(wrapper.find(InvalidFormat)).toHaveLength(1);
    });

    afterEach(() => {
        parseCitationData.mockClear();
        composeRenderProps.mockClear();
        StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    });

    afterAll(() => {
        parseCitationData.resetMock();
        composeRenderProps.resetMock();
    });
});
