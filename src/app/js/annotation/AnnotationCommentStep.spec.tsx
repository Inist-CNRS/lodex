import { useForm } from '@tanstack/react-form';
// @ts-expect-error TS6133
import React from 'react';
import { render } from '../../../test-utils';
import { TestI18N } from '../i18n/I18NContext';
import {
    AnnotationCommentStep,
    CommentDescription,
} from './AnnotationCommentStep';

const renderAnnotationCommentStep = ({
    // @ts-expect-error TS7031
    kind,
    formatName = 'formatParagraph',
    ...props
}) => {
    let form;

    function TestAnnotationCommentStep({ ...props }) {
        form = useForm({
            defaultValues: {
                kind,
                initialValue: 'initialValue',
            },
        });
        return (
            <TestI18N>
                <AnnotationCommentStep
                    form={form}
                    initialValue="initialValue"
                    field={{
                        annotationFormat: 'text',
                        format: { name: formatName },
                    }}
                    {...props}
                />
            </TestI18N>
        );
    }
    const screen = render(<TestAnnotationCommentStep {...props} />);

    return {
        form,
        ...screen,
    };
};

describe('AnnotationCommentStep', () => {
    it('should render only the comment input when kind is comment', () => {
        const screen = renderAnnotationCommentStep({ kind: 'comment' });
        expect(
            screen.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).not.toBeInTheDocument();
    });
    it('should render only the comment input when kind is removal', () => {
        const screen = renderAnnotationCommentStep({ kind: 'removal' });
        expect(
            screen.queryByText(
                'annotation_remove_content_from+{"value":"initialValue"}',
            ),
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).not.toBeInTheDocument();
    });
    it('should render annotate value message when initialValue is an array', () => {
        const screen = renderAnnotationCommentStep({
            kind: 'removal',
            initialValue: ['initial', 'value'],
        });
        expect(
            screen.queryByText(
                'annotation_remove_value+{"value":"initialValue"}',
            ),
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).not.toBeInTheDocument();
    });

    it('should render annotation_remove_content instead of annotation_remove_value when field format is for url and kind is removal', () => {
        const screen = renderAnnotationCommentStep({
            kind: 'removal',
            formatName: 'sparqlTextField',
        });
        expect(
            screen.queryByText('annotation_remove_content'),
        ).toBeInTheDocument();
    });

    it('should render the comment and proposedValue input when kind is correction', () => {
        const screen = renderAnnotationCommentStep({ kind: 'correction' });
        expect(
            screen.queryByText(
                'annotation_correct_value+{"value":"initialValue"}',
            ),
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });

    it('should render annotation_add_content instead of annotation_remove_value when field format is for url and kind is correction', () => {
        const screen = renderAnnotationCommentStep({
            kind: 'correction',
            formatName: 'sparqlTextField',
        });
        expect(
            screen.queryByText('annotation_correct_content'),
        ).toBeInTheDocument();
    });

    it('should render the comment and proposedValue input when kind is addition', () => {
        const screen = renderAnnotationCommentStep({ kind: 'addition' });
        expect(screen.queryByText('annotation_add_value')).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });

    it('should render the proposedValue as select if field is a list', () => {
        const screen = renderAnnotationCommentStep({
            kind: 'addition',
            field: {
                annotationFormat: 'list',
                annotationFormatListOptions: ['option 1'],
            },
        });
        expect(screen.queryByText('annotation_add_value')).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('combobox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });

    describe('CommentDescription', () => {
        // @ts-expect-error TS7006
        function TestCommentDescription(props) {
            return (
                <TestI18N>
                    <CommentDescription {...props} />
                </TestI18N>
            );
        }

        it('should render annotation_remove_content_from when kind is removal field not an url and initialValue not an array', () => {
            const screen = render(
                <TestCommentDescription
                    kind="removal"
                    annotationInitialValue="initialValue"
                    fieldInitialValue="initialValue"
                    isFieldAnUrl={false}
                />,
            );
            expect(
                screen.queryByText(
                    'annotation_remove_content_from+{"value":"initialValue"}',
                ),
            ).toBeInTheDocument();
        });

        it('should render annotation_remove_value when kind is removal field not an url and initialValue is an array', () => {
            const screen = render(
                <TestCommentDescription
                    kind="removal"
                    annotationInitialValue="initial"
                    fieldInitialValue={['initial', 'value']}
                    isFieldAnUrl={false}
                />,
            );
            expect(
                screen.queryByText(
                    'annotation_remove_value+{"value":"initial"}',
                ),
            ).toBeInTheDocument();
        });

        it('should render annotation_remove_content when kind is removal field is an url', () => {
            const screen = render(
                <TestCommentDescription
                    kind="removal"
                    annotationInitialValue="initialValue"
                    fieldInitialValue="initialValue"
                    isFieldAnUrl
                />,
            );
            expect(
                screen.queryByText('annotation_remove_content'),
            ).toBeInTheDocument();
        });

        it('should render annotation_remove_content when kind is removal field is an url even when initialValue is an array', () => {
            const screen = render(
                <TestCommentDescription
                    kind="removal"
                    annotationInitialValue={['initialValue']}
                    fieldInitialValue="initialValue"
                    isFieldAnUrl
                />,
            );
            expect(
                screen.queryByText('annotation_remove_content'),
            ).toBeInTheDocument();
        });

        it('should render annotation_correct_content when kind is correction and field is an url', () => {
            const screen = render(
                <TestCommentDescription
                    kind="correction"
                    annotationInitialValue="initialValue"
                    fieldInitialValue="initialValue"
                    isFieldAnUrl
                />,
            );
            expect(
                screen.queryByText('annotation_correct_content'),
            ).toBeInTheDocument();
        });

        it('should render annotation_correct_value when kind is correction and field not an url', () => {
            const screen = render(
                <TestCommentDescription
                    kind="correction"
                    annotationInitialValue="initialValue"
                    fieldInitialValue="initialValue"
                    isFieldAnUrl={false}
                />,
            );
            expect(
                screen.queryByText(
                    'annotation_correct_value+{"value":"initialValue"}',
                ),
            ).toBeInTheDocument();
        });

        it('should render annotation_add_value when kind is addition', () => {
            const screen = render(
                <TestCommentDescription
                    kind="addition"
                    annotationInitialValue="initialValue"
                    fieldInitialValue="initialValue"
                    isFieldAnUrl
                />,
            );
            expect(
                screen.queryByText('annotation_add_value'),
            ).toBeInTheDocument();
        });

        it('should render annotation_general_comment when kind is comment', () => {
            const screen = render(
                <TestCommentDescription
                    kind="comment"
                    annotationInitialValue="initialValue"
                    fieldInitialValue="initialValue"
                    isFieldAnUrl={false}
                />,
            );
            expect(
                screen.queryByText('annotation_general_comment'),
            ).toBeInTheDocument();
        });
    });
});
