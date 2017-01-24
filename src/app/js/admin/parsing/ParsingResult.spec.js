import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import ParsingExcerpt from './ParsingExcerpt';
import ParsingSummary from './ParsingSummary';

import { ParsingResultComponent as ParsingResult } from './ParsingResult';

describe('<ParsingResult />', () => {
    it('should render the ParsingSummary', () => {
        const wrapper = shallow(<ParsingResult
            failedLines={[{}, {}]}
            p={{ t: () => {} }}
            totalLoadedLines={24}
        />);

        const parsingSummary = wrapper.find(ParsingSummary).at(0);

        expect(parsingSummary.prop('showErrors')).toEqual(false);
        expect(parsingSummary.prop('totalLoadedLines')).toEqual(24);
    });

    it('should render the ParsingExcerpt if showErrors is false', () => {
        const wrapper = shallow(<ParsingResult
            excerptColumns={['foo']}
            excerptLines={['bar']}
            failedLines={[]}
            p={{ t: () => {} }}
            totalLoadedLines={24}
        />);

        const parsingExcerpt = wrapper.find(ParsingExcerpt).at(0);

        expect(parsingExcerpt.prop('columns')).toEqual(['foo']);
        expect(parsingExcerpt.prop('lines')).toEqual(['bar']);
    });
});
