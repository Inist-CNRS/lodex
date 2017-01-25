import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';

import CircularProgress from 'material-ui/CircularProgress';
import ParsingResult from './parsing/ParsingResult';
import Upload from './upload/Upload';
import { AdminComponent } from './Admin';

describe('<Admin />', () => {
    it('should call loadParsingResult on mount', () => {
        const loadParsingResult = createSpy();
        shallow(<AdminComponent hasUploadedFile loadParsingResult={loadParsingResult} loadPublication={() => {}} />);
        expect(loadParsingResult).toHaveBeenCalled();
    });

    it('should call loadPublication on mount', () => {
        const loadPublication = createSpy();
        shallow(<AdminComponent hasUploadedFile loadPublication={loadPublication} loadParsingResult={() => {}} />);
        expect(loadPublication).toHaveBeenCalled();
    });

    it('should render spinner when loading', () => {
        const wrapper = shallow(<AdminComponent
            hasUploadedFile
            loadParsingResult={() => {}}
            loadPublication={() => {}}
            loadingParsingResult
        />);
        expect(wrapper.find(CircularProgress).length).toEqual(1);
    });

    it('should render the ParsingResult', () => {
        const wrapper = shallow(<AdminComponent
            hasUploadedFile
            loadParsingResult={() => {}}
            loadPublication={() => {}}
        />);
        expect(wrapper.contains(<ParsingResult />)).toEqual(true);
    });

    it('should render the Upload when no file umpladede', () => {
        const wrapper = shallow(<AdminComponent
            loadParsingResult={() => {}}
            loadPublication={() => {}}
        />);
        expect(wrapper.contains(<ParsingResult />)).toEqual(false);
        expect(wrapper.contains(<Upload />)).toEqual(true);
    });
});
