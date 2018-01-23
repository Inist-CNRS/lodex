import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import { ListItem } from 'material-ui/List';
import PdfIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import pick from 'lodash.pick';

import { IstexItemComponent } from './IstexItem';

describe('<IstexItem />', () => {

    it('should display one a with correct props', () => {
        const wrapper = shallow(
            <IstexItemComponent
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
