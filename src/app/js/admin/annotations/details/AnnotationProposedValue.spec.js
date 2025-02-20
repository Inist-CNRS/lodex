import { render, within } from '@testing-library/react';
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

        const list = wrapper.getByRole('list');
        expect(list).toBeInTheDocument();

        const items = within(list).queryAllByRole('listitem');

        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('value1');
        expect(items[1]).toHaveTextContent('value2');
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
