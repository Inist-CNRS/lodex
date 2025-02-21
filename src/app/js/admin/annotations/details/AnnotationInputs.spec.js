import { useForm } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../../test-utils';
import { TestI18N } from '../../../i18n/I18NContext';
import { useUpdateAnnotation } from './../hooks/useUpdateAnnotation';
import { AnnotationInputs } from './AnnotationInputs';

jest.mock('../hooks/useUpdateAnnotation', () => ({
    useUpdateAnnotation: jest.fn(),
}));

const TestForm = ({ annotation }) => {
    const form = useForm({
        defaultValues: {
            status: annotation.status,
            internalComment: annotation.internalComment,
            administrator: annotation.administrator,
            adminComment: annotation.adminComment,
        },
        onSubmit: () => {},
    });
    return (
        <form>
            <AnnotationInputs form={form} />
        </form>
    );
};

TestForm.propTypes = {
    annotation: PropTypes.object,
};

describe('AnnotationInputs', () => {
    it('should render form for status, internalComment, adminComment and administrator', () => {
        const handleUpdateAnnotation = jest.fn();
        jest.mocked(useUpdateAnnotation).mockImplementation(() => ({
            handleUpdateAnnotation,
            isSubmitting: false,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <TestForm
                        annotation={{
                            status: 'to_review',
                            administrator: 'Admin',
                            internalComment: 'Internal test comment',
                            adminComment:
                                'Admin comment visible to contributors',
                        }}
                    />
                </MemoryRouter>
            </TestI18N>,
        );

        const inputsRegion = wrapper.getByRole('group', {
            name: 'annotation_form_title',
        });
        expect(inputsRegion).toBeInTheDocument();
        expect(
            wrapper.queryByLabelText('annotation_status', {
                container: inputsRegion,
            }),
        ).toHaveTextContent('annotation_status_to_review');
        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_internal_comment',
                container: inputsRegion,
            }),
        ).toHaveValue('Internal test comment');
        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_admin_comment',
                container: inputsRegion,
            }),
        ).toHaveValue('Admin comment visible to contributors');
        expect(
            wrapper.getByRole('textbox', {
                name: 'annotation_administrator',
                container: inputsRegion,
            }),
        ).toHaveValue('Admin');
    });
});
