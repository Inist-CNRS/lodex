import React from 'react';
import { shallow } from 'enzyme';

import Loading from '../lib/components/Loading';
import ParsingResult from './parsing/ParsingResult';
import Upload from './upload/Upload';
import { DataComponent } from './Data';

describe('<Data />', () => {
    it('should render spinner when loading', () => {
        const wrapper = shallow(
            <DataComponent
                hasUploadedFile
                loadingParsingResult
                p={{ t: () => {} }}
            />,
        );
        expect(wrapper.find(Loading)).toHaveLength(1);
    });

    it('should render the ParsingResult', () => {
        const wrapper = shallow(
            <DataComponent hasUploadedFile p={{ t: () => {} }} />,
        );
        expect(wrapper.contains(<ParsingResult />)).toEqual(true);
    });

    it('should render the Upload when no file uploaded', () => {
        const wrapper = shallow(
            <DataComponent
                canUploadFile
                loadParsingResult={() => {}}
                loadPublication={() => {}}
                p={{ t: () => {} }}
            />,
        );
        expect(wrapper.find(ParsingResult)).toHaveLength(0);
        expect(wrapper.find(Upload)).toHaveLength(1);
    });
});
