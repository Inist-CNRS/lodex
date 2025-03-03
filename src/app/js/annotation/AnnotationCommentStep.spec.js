import { useForm } from '@tanstack/react-form';
import React from 'react';
import { render } from '../../../test-utils';
import { TestI18N } from '../i18n/I18NContext';
import { AnnotationCommentStep } from './AnnotationCommentStep';

const renderAnnotationCommentStep = ({ kind, ...props }) => {
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
                    }}
                    {...props}
                />
            </TestI18N>
        );
    }
    const wrapper = render(<TestAnnotationCommentStep {...props} />);

    return {
        form,
        ...wrapper,
    };
};

describe('AnnotationCommentStep', () => {
    it('should render only the comment input when kind is comment', () => {
        const wrapper = renderAnnotationCommentStep({ kind: 'comment' });
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).not.toBeInTheDocument();
    });
    it('should render only the comment input when kind is removal', () => {
        const wrapper = renderAnnotationCommentStep({ kind: 'removal' });
        expect(
            wrapper.queryByText(
                'annotation_remove_content+{"value":"initialValue"}',
            ),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).not.toBeInTheDocument();
    });
    it('should render annotate value message when initialValue is an array', () => {
        const wrapper = renderAnnotationCommentStep({
            kind: 'removal',
            initialValue: ['initial', 'value'],
        });
        expect(
            wrapper.queryByText(
                'annotation_remove_value+{"value":"initialValue"}',
            ),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).not.toBeInTheDocument();
    });

    it('should render the comment and proposedValue input when kind is correction', () => {
        const wrapper = renderAnnotationCommentStep({ kind: 'correction' });
        expect(
            wrapper.queryByText(
                'annotation_correct_value+{"value":"initialValue"}',
            ),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });

    it('should render the comment and proposedValue input when kind is addition', () => {
        const wrapper = renderAnnotationCommentStep({ kind: 'addition' });
        expect(wrapper.queryByText('annotation_add_value')).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });

    it('should render the proposedValue as select if field is a list', () => {
        const wrapper = renderAnnotationCommentStep({
            kind: 'addition',
            field: {
                annotationFormat: 'list',
                annotationFormatListOptions: ['option 1'],
            },
        });
        expect(wrapper.queryByText('annotation_add_value')).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByRole('combobox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });
});
