import React from 'react';
import { render } from '../../../test-utils';
import {
    AnnotationList,
    getAnnotationSummaryValue,
    getAnnotationTitle,
} from './AnnotationList';
import { TestI18N } from '../i18n/I18NContext';

function TestAnnotationList({ field, annotations }) {
    return (
        <TestI18N>
            <AnnotationList annotations={annotations} field={field} />
        </TestI18N>
    );
}

describe('AnnotationList', () => {
    describe('getAnnotationSummaryValue', () => {
        it('should return the comment when the annotation kind is comment', () => {
            const annotation = { kind: 'comment', comment: 'comment' };
            expect(getAnnotationSummaryValue(annotation)).toBe('comment');
        });
        it('should return the initialValue -> proposed value when the annotation kind is correction', () => {
            const annotation = {
                kind: 'correction',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                'initialValue -> proposedValue',
            );
        });
        it('should return the initialValue when the annotation kind is removal', () => {
            const annotation = {
                kind: 'removal',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('initialValue');
        });
        it('should return the proposedValue when the annotation kind is addition', () => {
            const annotation = {
                kind: 'addition',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('proposedValue');
        });
        it('should return an empty string as a fallback otherwise', () => {
            const annotation = {};
            expect(getAnnotationSummaryValue(annotation)).toBe('');
        });
    });

    describe('getAnnotationTitle', () => {
        it('should return null when receiving no annotation', () => {
            expect(getAnnotationTitle(null, (v) => v)).toBe(null);
        });
        it('should return the annotation_home_page translation when the annotation has no resourceUri', () => {
            expect(getAnnotationTitle({ resourceUri: null }, (v) => v)).toBe(
                'annotation_home_page',
            );
        });
        it('should return the annotation_resource_not_found translation when the annotation has no resource', () => {
            expect(
                getAnnotationTitle(
                    { resourceUri: 'resourceUri', resource: null },
                    (v) => v,
                ),
            ).toBe('annotation_resource_not_found');
        });
        it('should return the annotation_graph_page translation when the annotation field scope is graphic', () => {
            expect(
                getAnnotationTitle({ field: { scope: 'graphic' } }, (v) => v),
            ).toBe('annotation_graph_page');
        });
        it('should return the resource title when the annotation has a resource', () => {
            expect(
                getAnnotationTitle(
                    {
                        resource: { title: 'resourceTitle', uri: 'uri' },
                        resourceUri: 'uri',
                    },
                    (v) => v,
                ),
            ).toBe('resourceTitle');
        });
    });

    describe('AnnotationList', () => {
        it('should display the annotation summaries', () => {
            const annotations = [
                {
                    _id: 'annotationId',
                    kind: 'comment',
                    comment: 'A comment',
                    proposedValue: null,
                    initialValue: null,
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'to_review',
                    isMine: false,
                },
                {
                    _id: 'annotationId',
                    kind: 'addition',
                    comment: 'Add this',
                    proposedValue: 'this',
                    initialValue: null,
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'ongoing',
                    isMine: true,
                },
                {
                    _id: 'annotationId',
                    kind: 'removal',
                    comment: 'remove that',
                    proposedValue: null,
                    initialValue: 'that',
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'validated',
                    isMine: false,
                },
                {
                    _id: 'annotationId',
                    kind: 'correction',
                    comment: 'correct that with this',
                    proposedValue: 'this',
                    initialValue: 'that',
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'rejected',
                    isMine: false,
                },
            ];
            const field = { label: 'fieldLabel' };
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(
                wrapper.queryByText('annotation_history'),
            ).toBeInTheDocument();
            expect(
                wrapper.queryByLabelText('annotation_resource'),
            ).toHaveTextContent('resourceTitle');

            expect(wrapper.queryAllByLabelText('annotation_kind')).toHaveLength(
                4,
            );

            expect(
                wrapper.queryAllByLabelText('annotation_summary_value'),
            ).toHaveLength(4);

            expect(
                wrapper.queryAllByLabelText('annotation_status'),
            ).toHaveLength(4);

            expect(wrapper.queryAllByLabelText('own_annotation')).toHaveLength(
                1,
            );

            expect(
                wrapper.queryAllByLabelText('annotation_kind')[0],
            ).toHaveTextContent('comment');
            expect(
                wrapper.queryAllByLabelText('annotation_summary_value')[0],
            ).toHaveTextContent('A comment');
            expect(
                wrapper.queryAllByLabelText('annotation_status')[0],
            ).toHaveTextContent('annotation_status_ongoing');

            expect(
                wrapper.queryAllByLabelText('annotation_kind')[1],
            ).toHaveTextContent('addition');
            expect(
                wrapper.queryAllByLabelText('annotation_summary_value')[1],
            ).toHaveTextContent('this');
            expect(
                wrapper.queryAllByLabelText('annotation_status')[1],
            ).toHaveTextContent('annotation_status_ongoing');

            expect(
                wrapper.queryAllByLabelText('annotation_kind')[2],
            ).toHaveTextContent('removal');
            expect(
                wrapper.queryAllByLabelText('annotation_summary_value')[2],
            ).toHaveTextContent('that');
            expect(
                wrapper.queryAllByLabelText('annotation_status')[2],
            ).toHaveTextContent('annotation_status_validated');

            expect(
                wrapper.queryAllByLabelText('annotation_kind')[3],
            ).toHaveTextContent('correction');
            expect(
                wrapper.queryAllByLabelText('annotation_summary_value')[3],
            ).toHaveTextContent('that -> this');
            expect(
                wrapper.queryAllByLabelText('annotation_status')[3],
            ).toHaveTextContent('annotation_status_rejected');
        });
        it('should display an annotation details', () => {
            const annotations = [
                {
                    _id: 'annotationId',
                    kind: 'correction',
                    comment: 'replace this with that',
                    proposedValue: 'that',
                    initialValue: 'this',
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'to_review',
                    createdAt: '2025-09-01T00:00:00.000Z',
                    updatedAt: '2025-10-01T00:00:00.000Z',
                    isMine: false,
                },
            ];
            const field = { label: 'fieldLabel' };
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(
                wrapper.queryByText('own_annotation'),
            ).not.toBeInTheDocument();
            expect(
                wrapper.queryByLabelText('annotation_initial_value'),
            ).toHaveTextContent('this');
            expect(
                wrapper.queryByLabelText('annotation_proposed_value'),
            ).toHaveTextContent('that');
            expect(
                wrapper.queryByLabelText('annotation_comment_section'),
            ).toHaveTextContent('replace this with that');
            expect(
                wrapper.queryByLabelText('annotation_updated_at'),
            ).toHaveTextContent('10/1/2025');
            expect(
                wrapper.queryByLabelText('annotation_created_at'),
            ).toHaveTextContent('9/1/2025');
        });
        it('should display own_annotation when isMine is true', () => {
            const annotations = [
                {
                    _id: 'annotationId',
                    kind: 'correction',
                    comment: 'replace this with that',
                    proposedValue: 'that',
                    initialValue: 'this',
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'to_review',
                    createdAt: '2025-09-01T00:00:00.000Z',
                    updatedAt: '2025-10-01T00:00:00.000Z',
                    isMine: true,
                },
            ];
            const field = { label: 'fieldLabel' };
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(wrapper.queryByText('own_annotation')).toBeInTheDocument();
        });

        it('should convert to_review status to ongoing', () => {
            const annotations = [
                {
                    _id: 'annotationId',
                    kind: 'comment',
                    comment: 'A comment',
                    proposedValue: null,
                    initialValue: null,
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'to_review',
                },
            ];
            const field = { label: 'fieldLabel' };
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(
                wrapper.queryAllByLabelText('annotation_status')[0],
            ).toHaveTextContent('annotation_status_ongoing');
        });
    });
});
