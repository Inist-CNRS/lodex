import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';

import CircularProgress from 'material-ui/CircularProgress';
import ParsingResult from './parsing/ParsingResult';
import { AdminComponent } from './Admin';

describe('<Admin />', () => {
    it('should call loadParsingResult on mount', () => {
        const loadParsingResult = createSpy();
        shallow(<AdminComponent loadParsingResult={loadParsingResult} loadingParsingResult />);
        expect(loadParsingResult).toHaveBeenCalled();
    });

    it('should render spinner when loading', () => {
        const wrapper = shallow(<AdminComponent loadParsingResult={() => {}} loadingParsingResult />);
        expect(wrapper.find(CircularProgress).length).toEqual(1);
    });

    it('should render the ParsingResult', () => {
        const wrapper = shallow(<AdminComponent
            loadParsingResult={() => {}}
        />);
        expect(wrapper.contains(<ParsingResult />)).toEqual(true);
    });
});
