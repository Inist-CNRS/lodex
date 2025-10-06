import { useForm } from '@tanstack/react-form';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PropTypes from 'prop-types';
import React from 'react';
import { TestI18N } from '../../i18n/I18NContext';
import { COMMENT_STEP, VALUE_STEP } from '../steps';
import { TargetField } from './TargetField';

const renderTargetField = (props) => {
    let form;

    function TestTargetField({ field = {}, ...props }) {
        form = useForm();
        return (
            <TestI18N>
                <TargetField
                    form={form}
                    initialValue="initial value"
                    goToStep={() => {}}
                    field={field}
                    {...props}
                />
            </TestI18N>
        );
    }

    TestTargetField.propTypes = {
        field: PropTypes.object,
    };

    const wrapper = render(<TestTargetField {...props} />);

    return {
        form,
        ...wrapper,
    };
};

describe('TargetField', () => {
    it('should display choice to comment, correct, add or remove', () => {
        renderTargetField({});
        expect(
            screen.getByText('annotation_annotate_field_choice'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('annotation_correct_content'),
        ).toBeInTheDocument();
        expect(screen.getByText('annotation_add_content')).toBeInTheDocument();
        expect(
            screen.getByText('annotation_remove_content_choice'),
        ).toBeInTheDocument();
    });

    it('should call goToStep with COMMENT_STEP when targeting title and set target to title, kind to comment, initialValue to null', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        await waitFor(() => {
            fireEvent.click(
                screen.getByText('annotation_annotate_field_choice'),
            );
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'title',
            kind: 'comment',
            initialValue: null,
        });
    });

    it('should call goToStep with COMMENT_STEP when there is a single value and clicking on annotation_correct_content, and set target to value, kind to correction, initialValue to "initialValue"', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        await waitFor(() => {
            fireEvent.click(screen.getByText('annotation_correct_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'correction',
            initialValue: 'initial value',
        });
    });

    it('should call goToStep with VALUE_STEP when there is an array of values and clicking on annotation_correct_content, and set target to value, kind to correction', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: ['initial', 'value'],
        });
        await waitFor(() => {
            fireEvent.click(screen.getByText('annotation_correct_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(VALUE_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'correction',
        });
    });

    it('should call goToStep with COMMENT_STEP when there is a single value and clicking on annotation_remove_content_choice, and set target to value, kind to removal, initialValue to "initial value"', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        await waitFor(() => {
            fireEvent.click(
                screen.getByText('annotation_remove_content_choice'),
            );
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'removal',
            initialValue: 'initial value',
        });
    });

    it('should call goToStep with VALUE_STEP when there is an array of values and clicking on annotation_remove_content_choice, and set target to value, kind to removal', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: ['initial', 'value'],
        });
        await waitFor(() => {
            fireEvent.click(
                screen.getByText('annotation_remove_content_choice'),
            );
        });
        expect(goToStep).toHaveBeenCalledWith(VALUE_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'removal',
        });
    });

    it('should call goToStep with COMMENT_STEP when there is a single value and clicking on annotation_add_content, and set target to value, kind to addition, initialValue to null', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        await waitFor(() => {
            fireEvent.click(screen.getByText('annotation_add_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'addition',
            initialValue: null,
        });
    });

    it('should call goToStep with COMMENT_STEP when there is an array of values and clicking on annotation_add_content, and set target to value, kind to addition, initialValue to null', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: ['initial', 'value'],
        });
        await waitFor(() => {
            fireEvent.click(screen.getByText('annotation_add_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'addition',
            initialValue: null,
        });
    });

    describe('field configuration', () => {
        it('should not display add value button if disabled', () => {
            const goToStep = jest.fn();
            const wrapper = renderTargetField({
                goToStep,
                initialValue: ['initial', 'value'],
                field: {
                    enableAnnotationKindAddition: false,
                },
            });

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_remove_content_choice',
                }),
            ).toBeInTheDocument();
        });

        it('should not display correct value button if disabled', () => {
            const goToStep = jest.fn();
            const wrapper = renderTargetField({
                goToStep,
                initialValue: ['initial', 'value'],
                field: {
                    enableAnnotationKindCorrection: false,
                },
            });

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            ).not.toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_remove_content_choice',
                }),
            ).toBeInTheDocument();
        });

        it('should not display remove value button if disabled', () => {
            const goToStep = jest.fn();
            const wrapper = renderTargetField({
                goToStep,
                initialValue: ['initial', 'value'],
                field: {
                    enableAnnotationKindRemoval: false,
                },
            });

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_add_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_correct_content',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('menuitem', {
                    name: 'annotation_remove_content_choice',
                }),
            ).not.toBeInTheDocument();
        });
    });
});
