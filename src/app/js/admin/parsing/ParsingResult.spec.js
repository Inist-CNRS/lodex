import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import ParsingExcerpt from './ParsingExcerpt';

import { ParsingResultComponent as ParsingResult } from './ParsingResult';

describe('<ParsingResult />', () => {
    it('should render the ParsingExcerpt', () => {
        const wrapper = shallow(
            <ParsingResult
                excerptColumns={['foo']}
                excerptLines={['bar']}
                p={{ t: () => {} }}
                totalLoadedLines={24}
            />,
        );

        const parsingExcerpt = wrapper.find(ParsingExcerpt).at(0);

        expect(parsingExcerpt.prop('columns')).toEqual(['foo']);
        expect(parsingExcerpt.prop('lines')).toEqual(['bar']);
    });
});
