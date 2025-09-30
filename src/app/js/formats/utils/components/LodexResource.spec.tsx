// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';

import LodexResource from './LodexResource';
import Link from '../../../lib/components/Link';

describe('LodexResource', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render Link with to=id if id is of type uid', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <LodexResource
                id="uid:/id"
                url="http://localhost:3000/uid:/id"
                title="title"
                summary="summary"
            />,
        );

        const link = wrapper.find(Link);

        expect(link.prop('to')).toBe('/uid:/id');
    });

    it('should render Link with to=id if id is of type ark', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <LodexResource
                id="ark:/id"
                url="http://localhost:3000/ark:/uid"
                title="title"
                summary="summary"
            />,
        );

        const link = wrapper.find(Link);

        expect(link.prop('to')).toBe('/ark:/id');
    });

    it('should render a with href=url if id is not local', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <LodexResource
                id="id"
                url="http://otherSiteUrl"
                title="title"
                summary="summary"
            />,
        );

        const link = wrapper.find(Link);

        expect(link.prop('href')).toBe('http://otherSiteUrl');
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
