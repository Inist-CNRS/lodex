import React from 'react';
import { fireEvent, render, waitFor } from '../../../test-utils';
import { TestI18N } from '../i18n/I18NContext';
import { OpenHistoricButton } from './OpenHistoricButton';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

jest.mock('./useGetFieldAnnotation', () => ({
    useGetFieldAnnotation: jest.fn().mockReturnValue({
        data: [],
        error: null,
        isLoading: false,
    }),
}));
describe('OpenHistoricButton', () => {
    it('should call useGetFieldAnnotation with field id and resource uri and display a button to see the annotations', async () => {
        useGetFieldAnnotation.mockReturnValue({
            data: [
                {
                    _id: 'annotationId',
                    kind: 'correct',
                    comment: 'comment',
                    proposedValue: 'proposedValue',
                    initialValue: 'initialValue',
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                },
            ],
            error: null,
            isLoading: false,
        });
        const wrapper = render(
            <TestI18N>
                <OpenHistoricButton
                    field={{ _id: 'fieldId', label: 'fieldLabel' }}
                    resourceUri="resourceUri"
                />
            </TestI18N>,
        );
        expect(useGetFieldAnnotation).toHaveBeenCalledWith(
            'fieldId',
            'resourceUri',
        );

        expect(
            wrapper.queryByText(
                'annotation_history+{"fieldLabel":"fieldLabel"}',
            ),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByText('annotation_open_history+{"smart_count":1}'),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByText('annotation_open_history+{"smart_count":1}'),
        ).not.toBeDisabled();
        await waitFor(() => {
            fireEvent.click(
                wrapper.queryByText(
                    'annotation_open_history+{"smart_count":1}',
                ),
            );
        });
        expect(wrapper.getByLabelText('annotation_resource')).toHaveTextContent(
            'resourceTitle',
        );
        expect(wrapper.getByLabelText('annotation_kind')).toHaveTextContent(
            'correct',
        );
        expect(
            wrapper.getByLabelText('annotation_initial_value'),
        ).toHaveTextContent('initialValue');
        expect(
            wrapper.getByLabelText(
                'annotation_proposed_value+{"smart_count":1}',
            ),
        ).toHaveTextContent('proposedValue');
        expect(
            wrapper.getByLabelText('annotation_comment_section'),
        ).toHaveTextContent('comment');
    });
    it('should display a disabled button when receiving no annotations([])', () => {
        useGetFieldAnnotation.mockReturnValue({
            data: [],
            error: null,
            isLoading: false,
        });
        const wrapper = render(
            <TestI18N>
                <OpenHistoricButton
                    field={{ _id: 'fieldId', label: 'fieldLabel' }}
                    resourceUri="resourceUri"
                />
            </TestI18N>,
        );
        expect(useGetFieldAnnotation).toHaveBeenCalledWith(
            'fieldId',
            'resourceUri',
        );

        expect(
            wrapper.queryByText(
                'annotation_history+{"fieldLabel":"fieldLabel"}',
            ),
        ).toBeInTheDocument();
        expect(
            wrapper.queryByText('annotation_no_history'),
        ).toBeInTheDocument();
        expect(wrapper.queryByText('annotation_no_history')).toBeDisabled();
    });
    it('should display loading while loading the annotations', () => {
        useGetFieldAnnotation.mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        });
        const wrapper = render(
            <TestI18N>
                <OpenHistoricButton
                    field={{ _id: 'fieldId', label: 'fieldLabel' }}
                    resourceUri="resourceUri"
                />
            </TestI18N>,
        );
        expect(useGetFieldAnnotation).toHaveBeenCalledWith(
            'fieldId',
            'resourceUri',
        );

        expect(
            wrapper.queryByText(
                'annotation_history+{"fieldLabel":"fieldLabel"}',
            ),
        ).toBeInTheDocument();
        expect(wrapper.queryByText('loading')).toBeInTheDocument();
    });
});
