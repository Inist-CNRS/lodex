import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import Loading from '../lib/components/Loading';
import ParsingResult from './parsing/ParsingResult';
import Upload from './upload/Upload';
import { AdminComponent } from './Admin';

describe('<Admin />', () => {
    it('should render spinner when loading', () => {
        const wrapper = shallow(
            <AdminComponent
                hasUploadedFile
                loadingParsingResult
                p={{ t: () => {} }}
            />,
        );
        expect(wrapper.find(Loading).length).toEqual(1);
    });

    it('should render the ParsingResult', () => {
        const wrapper = shallow(
            <AdminComponent hasUploadedFile p={{ t: () => {} }} />,
        );
        expect(wrapper.contains(<ParsingResult />)).toEqual(true);
    });

    it('should render the Upload when no file uploaded', () => {
        const wrapper = shallow(
            <AdminComponent
                canUploadFile
                loadParsingResult={() => {}}
                loadPublication={() => {}}
                p={{ t: () => {} }}
            />,
        );
        expect(wrapper.find(ParsingResult).length).toEqual(0);
        expect(wrapper.find(Upload).length).toEqual(1);
    });
});
