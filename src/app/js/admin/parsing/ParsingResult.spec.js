import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import ParsingErrors from './ParsingErrors';
import ParsingExcerpt from './ParsingExcerpt';
import ParsingSummary from './ParsingSummary';

import ParsingResult from './ParsingResult';

describe('<ParsingResult />', () => {
    it('should render the ParsingSummary', () => {
        const wrapper = shallow(<ParsingResult
            failedLines={[{}, {}]}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);

        const parsingSummary = wrapper.find(ParsingSummary).at(0);

        expect(parsingSummary.prop('showErrors')).toEqual(false);
        expect(parsingSummary.prop('totalFailedLines')).toEqual(2);
        expect(parsingSummary.prop('totalLoadedLines')).toEqual(24);
        expect(parsingSummary.prop('totalParsedLines')).toEqual(100);
    });

    it('should render the ParsingExcerpt if showErrors is false', () => {
        const wrapper = shallow(<ParsingResult
            excerptColumns={['foo']}
            excerptLines={['bar']}
            failedLines={[]}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);

        const parsingExcerpt = wrapper.find(ParsingExcerpt).at(0);

        expect(parsingExcerpt.prop('columns')).toEqual(['foo']);
        expect(parsingExcerpt.prop('lines')).toEqual(['bar']);
    });

    it('should render the ParsingExcerpt if showErrors is true', () => {
        const wrapper = shallow(<ParsingResult
            excerptColumns={['foo']}
            excerptLines={['bar']}
            failedLines={['error']}
            totalLoadedLines={24}
            totalParsedLines={100}
        />);

        wrapper.setState({ showErrors: true });

        const parsingErrors = wrapper.find(ParsingErrors).at(0);

        expect(parsingErrors.prop('lines')).toEqual(['error']);
    });
});
