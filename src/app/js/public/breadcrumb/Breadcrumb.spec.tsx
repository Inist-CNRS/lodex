// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';

import { Breadcrumb } from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';

describe('Breadcrumb', () => {
    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
    });

    it('should not create a breadcrumb trail with an empty configuration', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <Breadcrumb
                breadcrumb={[]}
                location={{
                    pathname: '/uid:/0568XNKN',
                }}
            />,
        );
        const link = wrapper.find(BreadcrumbItem);

        expect(link).toHaveLength(0);
    });

    it('should create the breadcrumb trail with an item', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <Breadcrumb
                breadcrumb={[
                    {
                        // @ts-expect-error TS2353
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

        expect(link).toHaveLength(1);
    });

    it('should not create the breadcrumb trail with an item on the main page', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <Breadcrumb
                breadcrumb={[
                    {
                        // @ts-expect-error TS2353
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

        expect(link).toHaveLength(0);
    });
});
