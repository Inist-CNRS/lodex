import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';

import Loading from '../lib/Loading';
import ParsingResult from './parsing/ParsingResult';
import Upload from './upload/Upload';
import { AdminComponent } from './Admin';

describe('<Admin />', () => {
    it('should call loadParsingResult on mount', () => {
        const loadParsingResult = createSpy();
        shallow(<AdminComponent
            hasUploadedFile
            loadParsingResult={loadParsingResult}
            loadPublication={() => {}}
            p={{ t: () => {} }}
        />);
        expect(loadParsingResult).toHaveBeenCalled();
    });

    it('should call loadPublication on mount', () => {
        const loadPublication = createSpy();
        shallow(<AdminComponent
            hasUploadedFile
            loadPublication={loadPublication}
            loadParsingResult={() => {}}
            p={{ t: () => {} }}
        />);
        expect(loadPublication).toHaveBeenCalled();
    });

    it('should render spinner when loading', () => {
        const wrapper = shallow(<AdminComponent
            hasUploadedFile
            loadParsingResult={() => {}}
            loadPublication={() => {}}
            loadingParsingResult
            p={{ t: () => {} }}
        />);
        expect(wrapper.find(Loading).length).toEqual(1);
    });

    it('should render the ParsingResult', () => {
        const wrapper = shallow(<AdminComponent
            hasUploadedFile
            loadParsingResult={() => {}}
            loadPublication={() => {}}
            p={{ t: () => {} }}
        />);
        expect(wrapper.contains(<ParsingResult />)).toEqual(true);
    });

    it('should render the Upload when no file uploaded', () => {
        const wrapper = shallow(<AdminComponent
            canUploadFile
            loadParsingResult={() => {}}
            loadPublication={() => {}}
            p={{ t: () => {} }}
        />);
        expect(wrapper.find(ParsingResult).length).toEqual(0);
        expect(wrapper.find(Upload).length).toEqual(1);
    });
});
