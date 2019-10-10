import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import { Breadcrumb } from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';

describe('Breadcrumb', () => {
    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
    });

    it('should not create a breadcrumb trail with an empty configuration', () => {
        const wrapper = shallow(
            <Breadcrumb
                breadcrumb={[]}
                location={{
                    pathname: '/uid:/0568XNKN',
                }}
            />,
        );
        const link = wrapper.find(BreadcrumbItem);

        expect(link.length).toEqual(0);
    });

    it('should create the breadcrumb trail with an item', () => {
        const wrapper = shallow(
            <Breadcrumb
                breadcrumb={[
                    {
                        label: {
                            en: 'Data Istex',
                            fr: 'Accueil',
                        },
                        url: 'http://localhost:3000',
                    },
                ]}
                location={{
                    pathname: '/uid:/0568XNKN',
                }}
            />,
        );
        const link = wrapper.find(BreadcrumbItem);

        expect(link.length).toEqual(1);
    });

    it('should not create the breadcrumb trail with an item on the main page', () => {
        const wrapper = shallow(
            <Breadcrumb
                breadcrumb={[
                    {
                        label: {
                            en: 'Data Istex',
                            fr: 'Accueil',
                        },
                        url: 'http://localhost:3000',
                    },
                ]}
                location={{
                    pathname: '/',
                }}
            />,
        );
        const link = wrapper.find(BreadcrumbItem);

        expect(link.length).toEqual(0);
    });
});
