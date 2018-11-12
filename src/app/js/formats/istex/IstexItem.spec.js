import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import { IstexItemComponent } from './IstexItem';

import Link from '../../lib/components/Link';

describe('<IstexItem />', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

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
        const link = wrapper.find(Link);
        expect(link.length).toEqual(1);
        expect(link.props().href).toEqual('url');
    });
    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
