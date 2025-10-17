import { render } from '@testing-library/react';
// @ts-expect-error TS6133
import React from 'react';

import { AnnotationProposedValue } from './AnnotationProposedValue';

describe('AnnotationProposedValue', () => {
    it('should render value array if field can have multiple proposed values', () => {
        const wrapper = render(
            <AnnotationProposedValue
                proposedValue={['value1', 'value2']}
                field={{
                    annotationFormat: 'list',
                    annotationFormatListKind: 'multiple',
                }}
            />,
        );

        expect(wrapper.queryByText('[ value1, value2 ]')).toBeInTheDocument();
    });

    it('should render value first value if field can only have one value', () => {
        const wrapper = render(
            <AnnotationProposedValue
                proposedValue={['value1']}
                field={{
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                }}
            />,
        );

        expect(wrapper.queryByText('value1')).toBeInTheDocument();
    });

    it('should support proposed value as string for compatibility', () => {
        const wrapper = render(
            <AnnotationProposedValue
                proposedValue={'value1'}
                field={{
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                }}
            />,
        );

        expect(wrapper.queryByText('value1')).toBeInTheDocument();
    });

    it('should support text format', () => {
        const wrapper = render(
            <AnnotationProposedValue
                proposedValue={'value1'}
                field={{
                    annotationFormat: 'text',
                    annotationFormatListKind: 'single',
                }}
            />,
        );

        expect(wrapper.queryByText('value1')).toBeInTheDocument();
    });
});
