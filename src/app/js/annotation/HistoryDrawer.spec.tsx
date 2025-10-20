import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import React from 'react';
import defaultTheme from '../../custom/themes/default/defaultTheme';
import { TestI18N } from '../i18n/I18NContext';
import { HistoryDrawer } from './HistoryDrawer';
import { MODE_ALL, MODE_CLOSED, type Mode } from './HistoryDrawer.const';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

jest.mock('./useGetFieldAnnotation', () => ({
    useGetFieldAnnotation: jest.fn().mockReturnValue({
        data: [],
        error: null,
        isLoading: false,
    }),
}));

const theme = createTheme(defaultTheme);

interface TestHistoryDrawerProps {
    mode: Mode;
}

function TestHistoryDrawer({ mode: defaultMode }: TestHistoryDrawerProps) {
    const [mode, setMode] = React.useState(defaultMode);
    return (
        <ThemeProvider theme={theme}>
            <TestI18N>
                <HistoryDrawer
                    field={{ _id: 'fieldId', label: 'fieldLabel' }}
                    resourceUri="resourceUri"
                    mode={mode}
                    setMode={setMode}
                />
            </TestI18N>
        </ThemeProvider>
    );
}

describe('HistoryDrawer', () => {
    it('should not prefetch annotations if the drawer is closed', () => {
        const onClose = jest.fn();
        // @ts-expect-error TS2339
        useGetFieldAnnotation.mockReturnValue({
            data: undefined,
            error: null,
            isLoading: false,
        });
        const screen = render(
            // @ts-expect-error TS2322
            <TestHistoryDrawer mode={MODE_CLOSED} onClose={onClose} />,
        );
        expect(useGetFieldAnnotation).toHaveBeenCalledWith(
            'fieldId',
            'resourceUri',
            false,
        );
        expect(screen.queryByText('loading')).not.toBeInTheDocument();
    });

    it('should show annotations when mode is all', () => {
        // @ts-expect-error TS2339
        useGetFieldAnnotation.mockReturnValue({
            data: [
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
            ],
            error: null,
            isLoading: false,
        });

        const screen = render(<TestHistoryDrawer mode={MODE_ALL} />);
        expect(screen.queryByRole('presentation')).toBeInTheDocument();

        expect(useGetFieldAnnotation).toHaveBeenCalledWith(
            'fieldId',
            'resourceUri',
            true,
        );
        expect(screen.queryByText('loading')).not.toBeInTheDocument();

        expect(
            screen.queryByText(
                'annotation_history_for_field+{"fieldLabel":"fieldLabel"}',
            ),
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText('annotation_resource'),
        ).toHaveTextContent('resourceTitle');

        expect(screen.queryAllByLabelText('annotation_kind')).toHaveLength(4);

        expect(
            screen.queryAllByLabelText('annotation_summary_value'),
        ).toHaveLength(4);

        expect(screen.queryAllByLabelText('annotation_status')).toHaveLength(4);

        expect(screen.queryAllByLabelText('own_annotation')).toHaveLength(1);

        expect(
            screen.queryAllByLabelText('annotation_kind')[0],
        ).toHaveTextContent('comment');
        expect(
            screen.queryAllByLabelText('annotation_summary_value')[0],
        ).toHaveTextContent('A comment');
        expect(
            screen.queryAllByLabelText('annotation_status')[0],
        ).toHaveTextContent('annotation_status_ongoing');

        expect(
            screen.queryAllByLabelText('annotation_kind')[1],
        ).toHaveTextContent('addition');
        expect(
            screen.queryAllByLabelText('annotation_summary_value')[1],
        ).toHaveTextContent('this');
        expect(
            screen.queryAllByLabelText('annotation_status')[1],
        ).toHaveTextContent('annotation_status_ongoing');

        expect(
            screen.queryAllByLabelText('annotation_kind')[2],
        ).toHaveTextContent('removal');
        expect(
            screen.queryAllByLabelText('annotation_summary_value')[2],
        ).toHaveTextContent('that');
        expect(
            screen.queryAllByLabelText('annotation_status')[2],
        ).toHaveTextContent('annotation_status_validated');

        expect(
            screen.queryAllByLabelText('annotation_kind')[3],
        ).toHaveTextContent('correction');
        expect(
            screen.queryAllByLabelText('annotation_summary_value')[3],
        ).toHaveTextContent('that -> this');
        expect(
            screen.queryAllByLabelText('annotation_status')[3],
        ).toHaveTextContent('annotation_status_rejected');
    });

    it('should close the drawer when clicking on close button', () => {
        // @ts-expect-error TS2339
        useGetFieldAnnotation.mockReturnValue({
            data: [],
            error: null,
            isLoading: false,
        });
        const screen = render(<TestHistoryDrawer mode={MODE_ALL} />);
        expect(useGetFieldAnnotation).toHaveBeenCalledWith(
            'fieldId',
            'resourceUri',
            true,
        );

        screen
            .getByRole('button', {
                name: 'close',
            })
            .click();

        expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
});
