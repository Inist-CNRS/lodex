import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import { getBreadcrumb } from '../../../../api/controller/api/breadcrumb';

jest.mock('../../../../api/controller/api/breadcrumb', () => ({
    getBreadcrumb: jest.fn(),
}));

describe('Breadcrumb', () => {
    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
    });

    it('should not create a breadcrumb trail with an empty configuration', () => {
        getBreadcrumb.mockImplementation(() => {
            return [];
        });

        const wrapper = shallow(
            <Breadcrumb
                location={{
                    pathname: '/graph',
                }}
            />,
        );
        const link = wrapper.find(BreadcrumbItem);

        expect(link.length).toEqual(0);
    });

    it('should create the breadcrumb trail with an item', () => {
        getBreadcrumb.mockImplementation(() => {
            return [
                {
                    label: {
                        en: 'Data Istex',
                        fr: 'Accueil',
                    },
                    url: 'http://localhost:3000',
                },
            ];
        });

        const wrapper = shallow(
            <Breadcrumb
                location={{
                    pathname: '/graph',
                }}
            />,
        );
        const link = wrapper.find(BreadcrumbItem);

        expect(link.length).toEqual(1);
    });

    it('should not create the breadcrumb trail with an item on the main page', () => {
        getBreadcrumb.mockImplementation(() => {
            return [
                {
                    label: {
                        en: 'Data Istex',
                        fr: 'Accueil',
                    },
                    url: 'http://localhost:3000',
                },
            ];
        });

        const wrapper = shallow(
            <Breadcrumb
                location={{
                    pathname: '/',
                }}
            />,
        );
        const link = wrapper.find(BreadcrumbItem);

        expect(link.length).toEqual(0);
    });
});
