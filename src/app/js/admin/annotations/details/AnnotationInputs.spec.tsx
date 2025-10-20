import { useForm } from '@tanstack/react-form';
// @ts-expect-error TS6133
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../../test-utils';
import { TestI18N } from '../../../i18n/I18NContext';
import { useUpdateAnnotation } from './../hooks/useUpdateAnnotation';
import { AnnotationInputs } from './AnnotationInputs';

jest.mock('../hooks/useUpdateAnnotation', () => ({
    useUpdateAnnotation: jest.fn(),
}));

interface TestFormProps {
    annotation?: object;
}

const TestForm = ({ annotation }: TestFormProps) => {
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

describe('AnnotationInputs', () => {
    it('should render form for status, internalComment, adminComment and administrator', () => {
        const handleUpdateAnnotation = jest.fn();
        jest.mocked(useUpdateAnnotation).mockImplementation(() => ({
            handleUpdateAnnotation,
            isSubmitting: false,
        }));
        const screen = render(
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

        const inputsRegion = screen.getByRole('group', {
            name: 'annotation_form_title',
        });
        expect(inputsRegion).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation_status', {
                container: inputsRegion,
            }),
        ).toHaveTextContent('annotation_status_to_review');
        expect(
            screen.getByRole('textbox', {
                name: 'annotation_internal_comment',
                container: inputsRegion,
            }),
        ).toHaveValue('Internal test comment');
        expect(
            screen.getByRole('textbox', {
                name: 'annotation_admin_comment',
                container: inputsRegion,
            }),
        ).toHaveValue('Admin comment visible to contributors');
        expect(
            screen.getByRole('textbox', {
                name: 'annotation_administrator',
                container: inputsRegion,
            }),
        ).toHaveValue('Admin');
    });

    it.each([
        [true, 'validated'],
        [true, 'rejected'],
        [false, 'to_review'],
        [false, 'ongoing'],
    ])(
        `should set require={%s} on internalComment when status is %s`,
        (required, status) => {
            const handleUpdateAnnotation = jest.fn();
            jest.mocked(useUpdateAnnotation).mockImplementation(() => ({
                handleUpdateAnnotation,
                isSubmitting: false,
            }));
            const screen = render(
                <TestI18N>
                    <MemoryRouter>
                        <TestForm
                            annotation={{
                                status,
                                administrator: 'Admin',
                                internalComment: 'Internal test comment',
                                adminComment:
                                    'Admin comment visible to contributors',
                            }}
                        />
                    </MemoryRouter>
                </TestI18N>,
            );

            const inputsRegion = screen.getByRole('group', {
                name: 'annotation_form_title',
            });

            if (required) {
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation_internal_comment',
                        container: inputsRegion,
                    }),
                ).toHaveAttribute('required');
            } else {
                expect(
                    screen.getByRole('textbox', {
                        name: 'annotation_internal_comment',
                        container: inputsRegion,
                    }),
                ).not.toHaveAttribute('required');
            }
        },
    );
});
