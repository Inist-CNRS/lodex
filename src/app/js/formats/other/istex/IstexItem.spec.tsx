import React from 'react';
import { shallow } from 'enzyme';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';

import { IstexItemComponent } from './IstexItem';

import Link from '../../../lib/components/Link';

describe('<IstexItem />', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should display one a with correct props', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2741
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
        expect(link).toHaveLength(1);
        expect(link.props().href).toBe('url');
    });
    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
