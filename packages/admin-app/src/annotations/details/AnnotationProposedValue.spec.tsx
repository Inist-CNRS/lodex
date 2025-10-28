import { render, within } from '@testing-library/react';

import { TestI18N } from '../../../../../src/app/js/i18n/I18NContext';
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

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();

        const items = within(list).queryAllByRole('listitem');

        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('value1');
        expect(items[1]).toHaveTextContent('value2');
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

    it('should display add icon when value is not in the admin provided value list', () => {
        const screen = render(
            <TestI18N>
                <AnnotationProposedValue
                    proposedValue={['value1', 'value2']}
                    field={{
                        annotationFormat: 'list',
                        annotationFormatListKind: 'multiple',
                        annotationFormatListOptions: ['value1'],
                    }}
                />
            </TestI18N>,
        );

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();

        const items = within(list).queryAllByRole('listitem');

        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('value1');
        expect(items[1]).toHaveTextContent('value2');

        expect(
            screen.queryByLabelText(
                'annotation_user_provided_value+{"value":"value2"}',
            ),
        ).toBeInTheDocument();
    });
});
