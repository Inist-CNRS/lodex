import { shallow } from 'enzyme';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';

import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { TestI18N } from '../../../i18n/I18NContext';
import LodexResource from './LodexResource';
import Link from '../../../components/Link';

describe('LodexResource', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render Link with to=id if id is of type uid', () => {
        const wrapper = shallow(
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

    it('renders the footer after the summary', () => {
        render(
            <TestI18N locale="fr">
                <MemoryRouter>
                    <LodexResource
                        id="uid:/id"
                        url="http://localhost:3000/uid:/id"
                        title="title"
                        summary="summary"
                        footer={<span>the footer</span>}
                    />
                </MemoryRouter>
            </TestI18N>,
        );
        expect(screen.getByText('the footer')).toBeInTheDocument();
    });
});
