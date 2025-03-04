import React from 'react';
import { render, screen } from '../../../../test-utils';
import { FacetValueItemView } from './FacetValueItem';
import { TestI18N } from '../../i18n/I18NContext';

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
    });
});
