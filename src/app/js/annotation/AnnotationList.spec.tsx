import React from 'react';
import { act, render } from '../../../test-utils';
import { TestI18N } from '../i18n/I18NContext';
import {
    AnnotationList,
    getAnnotationSummaryValue,
    getAnnotationTitle,
} from './AnnotationList';
import { MODE_ALL } from './HistoryDrawer.const';

// @ts-expect-error TS7031
function TestAnnotationList({ field, annotations }) {
    const [mode, setMode] = React.useState(MODE_ALL);
    return (
        <TestI18N>
            <AnnotationList
                mode={mode}
                setMode={setMode}
                annotations={annotations}
                field={field}
            />
        </TestI18N>
    );
}

TestAnnotationList.propTypes = {
    field: AnnotationList.propTypes.field,
    annotations: AnnotationList.propTypes.annotations,
};

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
        it('should return the initialValue -> proposed value when the annotation kind is correction when they are number', () => {
            const annotation = {
                kind: 'correction',
                initialValue: 42,
                proposedValue: 19,
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('42 -> 19');
        });
        it('should return the initialValue -> proposed value when the annotation kind is correction when they are boolean', () => {
            const annotation = {
                kind: 'correction',
                initialValue: false,
                proposedValue: true,
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('false -> true');
        });
        it('should return the initialValue -> proposed value when the annotation kind is correction even when initial value is null', () => {
            const annotation = {
                kind: 'correction',
                initialValue: null,
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                '"" -> proposedValue',
            );
        });
        it('should return the initialValue -> proposed value when the annotation kind is correction even when initial value is undefined', () => {
            const annotation = {
                kind: 'correction',
                initialValue: undefined,
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                '"" -> proposedValue',
            );
        });
        it('should return the initialValue -> proposed value when the annotation kind is correction even when initial value is ""', () => {
            const annotation = {
                kind: 'correction',
                initialValue: '',
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                '"" -> proposedValue',
            );
        });
        it('should return the initialValue -> proposed value when the annotation kind is correction when proposedValue is an array', () => {
            const annotation = {
                kind: 'correction',
                initialValue: 'foo',
                proposedValue: ['bar', 'baz'],
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                'foo -> bar | baz',
            );
        });
        it('should should truncate the initialValue and proposed Value when they are longer than 16 characters', () => {
            const annotation = {
                kind: 'correction',
                initialValue:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                proposedValue:
                    'cogito ergo sum, vini vidi vici, alea jacta est',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                'Lorem ipsum dolo ... -> cogito ergo sum, ...',
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
        it('should return the initialValue even when null when the annotation kind is removal', () => {
            const annotation = {
                kind: 'removal',
                initialValue: null,
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('""');
        });
        it('should return the initialValue even when undefined when the annotation kind is removal', () => {
            const annotation = {
                kind: 'removal',
                initialValue: undefined,
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('""');
        });
        it('should return the initialValue even when "" when the annotation kind is removal', () => {
            const annotation = {
                kind: 'removal',
                initialValue: '',
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('""');
        });
        it('should return the number initialValue when the annotation kind is removal', () => {
            const annotation = {
                kind: 'removal',
                initialValue: 42,
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('42');
        });
        it('should return the boolean initialValue when the annotation kind is removal', () => {
            const annotation = {
                kind: 'removal',
                initialValue: false,
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('false');
        });
        it('should return the array initialValue when the annotation kind is removal', () => {
            const annotation = {
                kind: 'removal',
                initialValue: [true, false, 42, 'value', null, undefined, ''],
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                'true | false | 42 | value | "" | "" | ""',
            );
        });
        it('should return the proposedValue when the annotation kind is addition', () => {
            const annotation = {
                kind: 'addition',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
            };
            expect(getAnnotationSummaryValue(annotation)).toBe('proposedValue');
        });
        it('should return the proposedValues separated by | when the annotation kind is addition and proposed value is an array', () => {
            const annotation = {
                kind: 'addition',
                initialValue: 'initialValue',
                proposedValue: ['foo', 'bar', 'baz'],
            };
            expect(getAnnotationSummaryValue(annotation)).toBe(
                'foo | bar | baz',
            );
        });
        it('should return an empty string as a fallback otherwise', () => {
            const annotation = {};
            expect(getAnnotationSummaryValue(annotation)).toBe('');
        });
    });

    describe('getAnnotationTitle', () => {
        it('should return null when receiving no annotation', () => {
            // @ts-expect-error TS7006
            expect(getAnnotationTitle(null, (v) => v)).toBeNull();
        });

        it('should return the "annotation_home_page" when the annotation target the home page', () => {
            // @ts-expect-error TS7006
            expect(getAnnotationTitle({ resourceUri: '/' }, (v) => v)).toBe(
                'annotation_home_page',
            );

            // @ts-expect-error TS7006
            expect(getAnnotationTitle({ resourceUri: null }, (v) => v)).toBe(
                'annotation_home_page',
            );
        });

        it('should return the annotation_resource_not_found translation when the annotation has no resource', () => {
            expect(
                getAnnotationTitle(
                    { resourceUri: 'resourceUri', resource: null },
                    // @ts-expect-error TS7006
                    (v) => v,
                ),
            ).toBe('annotation_resource_not_found');
        });
        it('should return the annotation_graph_page translation when the annotation field scope is graphic', () => {
            expect(
                getAnnotationTitle(
                    { field: { name: 'gaVf', scope: 'graphic' } },
                    // @ts-expect-error TS7006
                    (v) => v,
                ),
            ).toBe('annotation_graph_page');
            expect(
                // @ts-expect-error TS7006
                getAnnotationTitle({ resourceUri: '/graph/gaVf' }, (v) => v),
            ).toBe('annotation_graph_page');
        });

        it('should return the resource title when the annotation has a resource', () => {
            expect(
                getAnnotationTitle(
                    {
                        resource: { title: 'resourceTitle', uri: 'uri' },
                        resourceUri: 'uri',
                    },
                    // @ts-expect-error TS7006
                    (v) => v,
                ),
            ).toBe('resourceTitle');
        });
    });

    describe('AnnotationList', () => {
        it('should display the annotation summaries', () => {
            const annotations = [
                {
                    _id: 'annotationId1',
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
                    _id: 'annotationId2',
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
                    _id: 'annotationId3',
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
                    _id: 'annotationId4',
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
            // @ts-expect-error TS2554
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(
                wrapper.queryByText(
                    'annotation_history_for_field+{"fieldLabel":"fieldLabel"}',
                ),
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
                    adminComment: 'Can you please provide more context?',
                    proposedValue: 'that',
                    initialValue: 'this',
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'to_review',
                    authorName: 'author name',
                    createdAt: '2025-09-01T00:00:00.000Z',
                    updatedAt: '2025-10-01T00:00:00.000Z',
                    isMine: false,
                },
            ];
            const field = { label: 'fieldLabel' };
            // @ts-expect-error TS2554
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
                wrapper.queryByLabelText(
                    'annotation_proposed_value+{"smart_count":1}',
                ),
            ).toHaveTextContent('that');
            expect(
                wrapper.queryByLabelText('annotation_contributor_section'),
            ).toHaveTextContent('hidden');
            expect(
                wrapper.queryByLabelText('annotation_comment_section'),
            ).toHaveTextContent('replace this with that');
            expect(
                wrapper.queryByLabelText('annotation_admin_comment_section'),
            ).toHaveTextContent('Can you please provide more context?');
            expect(
                wrapper.queryByLabelText('annotation_updated_at'),
            ).toHaveTextContent('10/1/2025');
            expect(
                wrapper.queryByLabelText('annotation_created_at'),
            ).toHaveTextContent('9/1/2025');
        });

        it('should show contributor when isContributorNamePublic is true', () => {
            const annotations = [
                {
                    _id: 'annotationId',
                    kind: 'correction',
                    comment: 'replace this with that',
                    adminComment: 'Can you please provide more context?',
                    proposedValue: 'that',
                    initialValue: 'this',
                    resourceUri: 'resourceUri',
                    field: { label: 'fieldLabel', scope: 'resource' },
                    resource: { title: 'resourceTitle', uri: 'resourceUri' },
                    status: 'to_review',
                    isContributorNamePublic: true,
                    authorName: 'author name',
                    createdAt: '2025-09-01T00:00:00.000Z',
                    updatedAt: '2025-10-01T00:00:00.000Z',
                    isMine: false,
                },
            ];
            const field = { label: 'fieldLabel' };
            // @ts-expect-error TS2554
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
                wrapper.queryByLabelText(
                    'annotation_proposed_value+{"smart_count":1}',
                ),
            ).toHaveTextContent('that');
            expect(
                wrapper.queryByLabelText('annotation_contributor_section'),
            ).toHaveTextContent('author name');
            expect(
                wrapper.queryByLabelText('annotation_comment_section'),
            ).toHaveTextContent('replace this with that');
            expect(
                wrapper.queryByLabelText('annotation_admin_comment_section'),
            ).toHaveTextContent('Can you please provide more context?');
            expect(
                wrapper.queryByLabelText('annotation_updated_at'),
            ).toHaveTextContent('10/1/2025');
            expect(
                wrapper.queryByLabelText('annotation_created_at'),
            ).toHaveTextContent('9/1/2025');
        });

        it('should hide initial value when kind is addition', () => {
            const annotations = [
                {
                    _id: 'annotationId',
                    kind: 'addition',
                    comment: 'replace this with that',
                    adminComment: 'Can you please provide more context?',
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
            // @ts-expect-error TS2554
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(
                wrapper.queryByLabelText('annotation_initial_value'),
            ).not.toBeInTheDocument();
        });
        it('should hide initial value when kind is comment', () => {
            const annotations = [
                {
                    _id: 'annotationId',
                    kind: 'comment',
                    comment: 'replace this with that',
                    adminComment: 'Can you please provide more context?',
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
            // @ts-expect-error TS2554
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(
                wrapper.queryByLabelText('annotation_initial_value'),
            ).not.toBeInTheDocument();
        });
        it.each([
            ['correction', null],
            ['correction', undefined],
            ['correction', ''],
            ['removal', null],
            ['removal', undefined],
            ['removal', ''],
        ])(
            'should show initial value when kind is %s even when %s',
            (kind, initialValue) => {
                const annotations = [
                    {
                        _id: 'annotationId',
                        kind,
                        comment: 'replace this with that',
                        adminComment: 'Can you please provide more context?',
                        proposedValue: 'that',
                        initialValue,
                        resourceUri: 'resourceUri',
                        field: { label: 'fieldLabel', scope: 'resource' },
                        resource: {
                            title: 'resourceTitle',
                            uri: 'resourceUri',
                        },
                        status: 'to_review',
                        createdAt: '2025-09-01T00:00:00.000Z',
                        updatedAt: '2025-10-01T00:00:00.000Z',
                        isMine: false,
                    },
                ];
                const field = { label: 'fieldLabel' };
                // @ts-expect-error TS2554
                const wrapper = render(
                    <TestAnnotationList
                        annotations={annotations}
                        field={field}
                    />,
                );
                expect(
                    wrapper.queryByLabelText('annotation_initial_value'),
                ).toHaveTextContent('""');
            },
        );

        it('should display all annotation details when clicking on expand_all_annotations', async () => {
            const annotations = [
                {
                    _id: 'annotationId1',
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
                    _id: 'annotationId2',
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
                    _id: 'annotationId3',
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
                    _id: 'annotationId4',
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
            // @ts-expect-error TS2554
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );

            await act(async () => {
                wrapper.getByLabelText('collapse_all_annotations').click();
            });

            expect(
                wrapper.queryAllByLabelText('annotation_initial_value'),
            ).toHaveLength(2);
            wrapper
                .queryAllByLabelText('annotation_initial_value')
                .forEach((element) => {
                    expect(element).not.toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText(
                    'annotation_proposed_value+{"smart_count":1}',
                ),
            ).toHaveLength(2);

            wrapper
                .queryAllByLabelText(
                    'annotation_proposed_value+{"smart_count":1}',
                )
                .forEach((element) => {
                    expect(element).not.toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText('annotation_comment_section'),
            ).toHaveLength(4);
            wrapper
                .queryAllByLabelText('annotation_comment_section')
                .forEach((element) => {
                    expect(element).not.toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText('annotation_updated_at'),
            ).toHaveLength(4);
            wrapper
                .queryAllByLabelText('annotation_updated_at')
                .forEach((element) => {
                    expect(element).not.toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText('annotation_created_at'),
            ).toHaveLength(4);
            wrapper
                .queryAllByLabelText('annotation_created_at')
                .forEach((element) => {
                    expect(element).not.toBeVisible();
                });

            await act(async () => {
                wrapper.getByLabelText('expand_all_annotations').click();
            });

            expect(
                wrapper.queryAllByLabelText('annotation_initial_value'),
            ).toHaveLength(2);
            wrapper
                .queryAllByLabelText('annotation_initial_value')
                .forEach((element) => {
                    expect(element).toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText(
                    'annotation_proposed_value+{"smart_count":1}',
                ),
            ).toHaveLength(2);

            wrapper
                .queryAllByLabelText(
                    'annotation_proposed_value+{"smart_count":1}',
                )
                .forEach((element) => {
                    expect(element).toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText('annotation_comment_section'),
            ).toHaveLength(4);
            wrapper
                .queryAllByLabelText('annotation_comment_section')
                .forEach((element) => {
                    expect(element).toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText('annotation_updated_at'),
            ).toHaveLength(4);
            wrapper
                .queryAllByLabelText('annotation_updated_at')
                .forEach((element) => {
                    expect(element).toBeVisible();
                });
            expect(
                wrapper.queryAllByLabelText('annotation_created_at'),
            ).toHaveLength(4);
            wrapper
                .queryAllByLabelText('annotation_created_at')
                .forEach((element) => {
                    expect(element).toBeVisible();
                });
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
            // @ts-expect-error TS2554
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
            // @ts-expect-error TS2554
            const wrapper = render(
                <TestAnnotationList annotations={annotations} field={field} />,
            );
            expect(
                wrapper.queryAllByLabelText('annotation_status')[0],
            ).toHaveTextContent('annotation_status_ongoing');
        });
    });
});
