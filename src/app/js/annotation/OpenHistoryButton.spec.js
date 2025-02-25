import React from 'react';
import { fireEvent, render, waitFor } from '../../../test-utils';
import { TestI18N } from '../i18n/I18NContext';
import { OpenHistoryButton } from './OpenHistoryButton';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

jest.mock('./useGetFieldAnnotation', () => ({
    useGetFieldAnnotation: jest.fn().mockReturnValue({
        data: [],
        error: null,
        isLoading: false,
    }),
}));

describe('OpenHistoryButton', () => {
    it('should call useGetFieldAnnotation with field id and resource uri and display a button to see the annotations', async () => {
        const openHistory = jest.fn();
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
                <OpenHistoryButton
                    field={{ _id: 'fieldId', label: 'fieldLabel' }}
                    resourceUri="resourceUri"
                    openHistory={openHistory}
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
        expect(openHistory).toHaveBeenCalled();
    });

    it('should display a disabled button when receiving no annotations([])', () => {
        const openHistory = jest.fn();
        useGetFieldAnnotation.mockReturnValue({
            data: [],
            error: null,
            isLoading: false,
        });
        const wrapper = render(
            <TestI18N>
                <OpenHistoryButton
                    field={{ _id: 'fieldId', label: 'fieldLabel' }}
                    resourceUri="resourceUri"
                    openHistory={openHistory}
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
        expect(
            wrapper.queryByText('annotation_no_history'),
        ).toBeInTheDocument();
        expect(openHistory).not.toHaveBeenCalled();
    });

    it('should display loading while loading the annotations', () => {
        const openHistory = jest.fn();
        useGetFieldAnnotation.mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        });
        const wrapper = render(
            <TestI18N>
                <OpenHistoryButton
                    field={{ _id: 'fieldId', label: 'fieldLabel' }}
                    resourceUri="resourceUri"
                    openHistory={openHistory}
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
        expect(openHistory).not.toHaveBeenCalled();
    });
});
