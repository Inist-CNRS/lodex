import React from 'react';
import { render } from '../../../../test-utils';
import { AnnotationForm } from './AnnotationForm';
import { TestI18N } from '../../i18n/I18NContext';
import { MemoryRouter } from 'react-router-dom';
import { useUpdateAnnotation } from './useUpdateAnnotation';

jest.mock('./useUpdateAnnotation', () => ({
    useUpdateAnnotation: jest.fn(),
}));

describe('AnnotationForm', () => {
    it('should render form for status internalComment and administrator', () => {
        const handleUpdateAnnotation = jest.fn();
        jest.mocked(useUpdateAnnotation).mockImplementation(() => ({
            handleUpdateAnnotation,
            isSubmitting: false,
        }));
        const wrapper = render(
            <TestI18N>
                <MemoryRouter>
                    <AnnotationForm
                        annotation={{
                            status: 'to_review',
                            administrator: 'Admin',
                            internalComment: 'Internal test comment',
                        }}
                    />
                </MemoryRouter>
            </TestI18N>,
        );
        expect(wrapper.queryByLabelText('annotation_status')).toHaveTextContent(
            'annotation_status_to_review',
        );
        expect(
            wrapper.queryByLabelText('annotation_internal_comment *'),
        ).toHaveTextContent('Internal test comment​');

        expect(
            wrapper.queryByLabelText('annotation_administrator'),
        ).toHaveValue('Admin');
    });
});
