import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';

import { IstexItemComponent } from './IstexItem';

describe('<IstexItem />', () => {
    it('should display one a with correct props', () => {
        const wrapper = shallow(
            <IstexItemComponent
                title="title"
                publicationDate="publicationDate"
                url="url"
                authors={['author1', 'author2']}
                hostTitle="hostTitle"
                hostGenre="hostGenre"
            />,
        );
        const a = wrapper.find('a');
        expect(a.length).toEqual(1);
        expect(a.props().href).toEqual('url');
    });
});
