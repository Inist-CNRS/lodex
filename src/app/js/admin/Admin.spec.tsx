// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';

import Loading from '../lib/components/Loading';
import ParsingResult from './parsing/ParsingResult';
import Upload from './upload/Upload';
import { AdminComponent } from './Admin';

describe('<Admin />', () => {
    it('should render spinner when loading', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <AdminComponent
                // @ts-expect-error TS2322
                hasUploadedFile
                loadingParsingResult
                p={{ t: () => {} }}
            />,
        );
        expect(wrapper.find(Loading)).toHaveLength(1);
    });

    it('should render the ParsingResult', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <AdminComponent hasUploadedFile p={{ t: () => {} }} />,
        );
        // @ts-expect-error TS2322
        expect(wrapper.contains(<ParsingResult />)).toBe(true);
    });

    it('should render the Upload when no file uploaded', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2322
            <AdminComponent
                canUploadFile
                // @ts-expect-error TS2322
                loadParsingResult={() => {}}
                loadPublication={() => {}}
                p={{ t: () => {} }}
            />,
        );
        expect(wrapper.find(ParsingResult)).toHaveLength(0);
        expect(wrapper.find(Upload)).toHaveLength(1);
    });
});
