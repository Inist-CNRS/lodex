// @ts-expect-error TS6133
import React from 'react';
import { render, screen } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { FacetValueItemView } from './FacetValueItem';

describe('FacetValueItem', () => {
    it('should render a null facet value as empty', () => {
        render(
            <TestI18N>
                <FacetValueItemView
                    facetValue={{
                        value: null,
                        count: 10,
                    }}
                    isChecked={false}
                    name="facet"
                />
            </TestI18N>,
        );

        expect(screen.getByText('empty')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });
    it('should render a "" facet value as empty', () => {
        render(
            <TestI18N>
                <FacetValueItemView
                    facetValue={{
                        value: '',
                        count: 10,
                    }}
                    isChecked={false}
                    name="facet"
                />
            </TestI18N>,
        );

        expect(screen.getByText('empty')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });
    it('should render facet.value otherwise', () => {
        render(
            <TestI18N>
                <FacetValueItemView
                    facetValue={{
                        value: 'facet value',
                        count: 10,
                    }}
                    isChecked={false}
                    name="facet"
                />
            </TestI18N>,
        );

        expect(screen.getByText('facet value')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });
});
