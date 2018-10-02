import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';

import { IstexSummaryItemComponent } from './IstexSummaryItem';

describe('<IstexItem />', () => {
    it('should display one a with correct props', () => {
        const wrapper = shallow(
            <IstexSummaryItemComponent
                title="title"
                publicationDate="publicationDate"
                url="url"
                authors="authors"
                hostTitle="hostTitle"
                hostGenre="hostGenre"
            />,
        );
        const a = wrapper.find('a');
        expect(a.length).toEqual(1);
        expect(a.props().href).toEqual('url');
    });
});
