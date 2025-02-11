import React from 'react';
import { AnnotationCommentStep } from './AnnotationCommentStep';
import { render } from '../../../test-utils';
import { useForm } from '@tanstack/react-form';
import { TestI18N } from '../i18n/I18NContext';

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
            wrapper.queryByLabelText('annotation.proposedValue *'),
        ).not.toBeInTheDocument();
    });
    it('should render only the comment input when kind is removal', () => {
        const wrapper = renderAnnotationCommentStep({ kind: 'removal' });
        expect(
            wrapper.queryByText('annotation_remove_value'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.proposedValue *'),
        ).not.toBeInTheDocument();
    });

    it('should render the comment and proposedValue input when kind is correct', () => {
        const wrapper = renderAnnotationCommentStep({ kind: 'correct' });
        wrapper.debug();
        expect(
            wrapper.queryByText('annotation_correct_value'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.comment *'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation.proposedValue *'),
        ).toBeInTheDocument();
    });
});
