import { render } from '@testing-library/react';

import { AnnotationProposedValue } from './AnnotationProposedValue';

describe('AnnotationProposedValue', () => {
    it('should render value array if field can have multiple proposed values', () => {
        const screen = render(
            <AnnotationProposedValue
                proposedValue={['value1', 'value2']}
                field={{
                    annotationFormat: 'list',
                    annotationFormatListKind: 'multiple',
                }}
            />,
        );

        expect(screen.queryByText('[ value1, value2 ]')).toBeInTheDocument();
    });

    it('should render value first value if field can only have one value', () => {
        const screen = render(
            <AnnotationProposedValue
                proposedValue={['value1']}
                field={{
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                }}
            />,
        );

        expect(screen.queryByText('value1')).toBeInTheDocument();
    });

    it('should support proposed value as string for compatibility', () => {
        const screen = render(
            <AnnotationProposedValue
                proposedValue={'value1'}
                field={{
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                }}
            />,
        );

        expect(screen.queryByText('value1')).toBeInTheDocument();
    });

    it('should support text format', () => {
        const screen = render(
            <AnnotationProposedValue
                proposedValue={'value1'}
                field={{
                    annotationFormat: 'text',
                    annotationFormatListKind: 'single',
                }}
            />,
        );

        expect(screen.queryByText('value1')).toBeInTheDocument();
    });
});
