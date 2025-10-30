import { useForm } from '@tanstack/react-form';

import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../../src/test-utils';
import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext';
import { useUpdateAnnotation } from '../hooks/useUpdateAnnotation';
import { AnnotationInputs } from './AnnotationInputs';
import { within } from '@testing-library/dom';

jest.mock('../hooks/useUpdateAnnotation', () => ({
    useUpdateAnnotation: jest.fn(),
}));

interface TestFormProps {
    annotation?: object;
}

const TestForm = ({ annotation }: TestFormProps) => {
    const form = useForm({
        defaultValues: {
            // @ts-expect-error TS18048
            status: annotation.status,
            // @ts-expect-error TS18048
            internalComment: annotation.internalComment,
            // @ts-expect-error TS18048
            administrator: annotation.administrator,
            // @ts-expect-error TS18048
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
            within(inputsRegion).queryByLabelText('annotation_status'),
        ).toHaveTextContent('annotation_status_to_review');
        expect(
            within(inputsRegion).getByRole('textbox', {
                name: 'annotation_internal_comment',
            }),
        ).toHaveValue('Internal test comment');
        expect(
            within(inputsRegion).getByRole('textbox', {
                name: 'annotation_admin_comment',
            }),
        ).toHaveValue('Admin comment visible to contributors');
        expect(
            within(inputsRegion).getByRole('textbox', {
                name: 'annotation_administrator',
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
                    within(inputsRegion).getByRole('textbox', {
                        name: 'annotation_internal_comment',
                    }),
                ).toHaveAttribute('required');
            } else {
                expect(
                    within(inputsRegion).getByRole('textbox', {
                        name: 'annotation_internal_comment',
                    }),
                ).not.toHaveAttribute('required');
            }
        },
    );
});
