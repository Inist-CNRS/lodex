import type { DataSource } from '@lodex/common';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { act } from 'react';
import { createEnrichment } from '../api/enrichment';
import { render } from '../test-utils';
import { EnrichmentForm, type EnrichmentFormProps } from './EnrichmentForm';
import type { Enrichment } from './index';
import { useListDataSource } from './useListDataSource';
import { usePreviewDataSource } from './usePreviewDataSource';

const Noop = () => <></>;
jest.mock('./EnrichmentStatus', () => Noop);
jest.mock('./RunButton', () => Noop);
jest.mock('../api/job', () => ({
    getJobLogs: () =>
        Promise.resolve({
            response: { logs: [] },
        }),
}));
jest.mock('./useListDataSource.tsx');
jest.mock('./usePreviewDataSource.tsx');
jest.mock('../api/enrichment', () => ({
    createEnrichment: jest.fn(),
    updatedEnrichment: jest.fn(),
}));

const dataSources: DataSource[] = [
    {
        id: 'dataset',
        name: 'dataset',
        columns: [
            {
                name: 'field1',
                subPaths: ['/test'],
            },
            {
                name: 'field2',
                subPaths: [],
            },
        ],
        isEmpty: false,
        status: 'FINISHED',
    },
    {
        id: 'precomputed1',
        name: 'Precomputed 1',
        columns: [],
        isEmpty: true,
        status: undefined,
    },
    {
        id: 'precomputed2',
        name: 'Precomputed 2',
        columns: [
            {
                name: 'id',
                subPaths: [],
            },
            {
                name: 'value',
                subPaths: [],
            },
        ],
        isEmpty: false,
        status: 'FINISHED',
    },
];

describe('<EnrichmentFormComponent />', () => {
    const defaultProps: EnrichmentFormProps = {
        history: {
            push: jest.fn(),
        },
        onLoadEnrichments: jest.fn(),
        onRetryEnrichment: jest.fn(),
        onLaunchEnrichment: jest.fn(),
        match: '/enrichment/123',
    };

    beforeAll(() => {
        jest.mocked(useListDataSource).mockReturnValue({
            getDataSourceById: (id: string) =>
                dataSources.find((ds) => ds.id === id),
            getDataSourceLabel: (id: string) =>
                dataSources.find((ds) => ds.id === id)?.name || id,
            dataSources: dataSources.map(({ id }) => id),
            isDataSourceListPending: false,
            error: null,
        });

        jest.mocked(usePreviewDataSource).mockImplementation(
            ({ dataSource }) => {
                if (dataSource?.id === 'dataset') {
                    return {
                        isPreviewPending: false,
                        previewData: [
                            { field1: { '/test': 'value1' }, field2: 'value2' },
                            { field1: { '/test': 'value3' }, field2: 'value4' },
                        ],
                    };
                }

                return {
                    isPreviewPending: false,
                    previewData: [],
                };
            },
        );
    });

    it('should render form', () => {
        const screen = render(<EnrichmentForm {...defaultProps} />);

        const nameField = screen.getByLabelText('fieldName *');
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue('');

        const webServiceUrlField = screen.getByLabelText('webServiceUrl *');
        expect(webServiceUrlField).toBeInTheDocument();
        expect(webServiceUrlField).toHaveValue('');

        const dataSourceField = screen.getByLabelText('dataSource *');
        expect(dataSourceField).toBeInTheDocument();
        expect(dataSourceField).toHaveValue('');

        const sourceColumnField = screen.getByLabelText('sourceColumn *');
        expect(sourceColumnField).toBeInTheDocument();
        expect(sourceColumnField).toHaveValue('');

        const subPathField = screen.getByLabelText('subPath');
        expect(subPathField).toBeInTheDocument();
        expect(subPathField).toHaveValue('');

        const submitButton = screen.getByText('save');
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    it('should render form with valid initial values', async () => {
        const initialValues = {
            advancedMode: false,
            _id: '123',
            status: 'FINISHED',
            name: 'Test Enrichment',
            dataSource: 'dataset',
            sourceColumn: 'field1',
            subPath: '/test',
            rule: '',
            webServiceUrl: 'http://example.com/api',
            jobId: 'job123',
            errorCount: 0,
        };

        const propsWithInitialValues: EnrichmentFormProps = {
            ...defaultProps,
            initialValues,
        };

        const screen = render(<EnrichmentForm {...propsWithInitialValues} />);

        const nameField = screen.getByLabelText('fieldName *');
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue('Test Enrichment');

        const advancedModeCheckbox = screen.getByLabelText('advancedMode');
        expect(advancedModeCheckbox).toBeInTheDocument();
        expect(advancedModeCheckbox).not.toBeChecked();

        const webServiceUrlField = screen.getByLabelText('webServiceUrl *');
        expect(webServiceUrlField).toBeInTheDocument();
        expect(webServiceUrlField).toHaveValue('http://example.com/api');

        const dataSourceField = screen.getByLabelText('dataSource *');
        expect(dataSourceField).toBeInTheDocument();
        expect(dataSourceField).toHaveValue('dataset');

        const sourceColumnField = screen.getByLabelText('sourceColumn *');
        expect(sourceColumnField).toBeInTheDocument();
        expect(sourceColumnField).toHaveValue('field1');

        const subPathField = screen.getByLabelText('subPath');
        expect(subPathField).toBeInTheDocument();
        expect(subPathField).toHaveValue('/test');

        const submitButton = screen.getByText('save');
        expect(submitButton).toBeInTheDocument();
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('should require the name field', async () => {
        const screen = render(
            <EnrichmentForm
                {...defaultProps}
                initialValues={{ name: 'test' } as unknown as Enrichment}
            />,
        );

        const nameField = screen.getByLabelText('fieldName *');
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue('test');
        expect(
            screen.queryByText('error_field_required'),
        ).not.toBeInTheDocument();

        await act(async () => {
            return fireEvent.change(nameField, { target: { value: '' } });
        });

        await waitFor(() => {
            expect(
                screen.getByText('error_field_required'),
            ).toBeInTheDocument();
        });
    });

    it('should require the webServiceUrl field', async () => {
        const screen = render(
            <EnrichmentForm
                {...defaultProps}
                initialValues={
                    { webServiceUrl: '/test' } as unknown as Enrichment
                }
            />,
        );

        const field = screen.getByLabelText('webServiceUrl *');
        expect(field).toBeInTheDocument();
        expect(field).toHaveValue('/test');
        expect(
            screen.queryByText('error_field_required'),
        ).not.toBeInTheDocument();

        await act(async () => {
            fireEvent.change(field, { target: { value: '' } });
        });

        await waitFor(() => {
            expect(
                screen.getByText('error_field_required'),
            ).toBeInTheDocument();
        });
    });

    it('should require the dataSource field', async () => {
        const screen = render(
            <EnrichmentForm
                {...defaultProps}
                initialValues={
                    { dataSource: 'dataset' } as unknown as Enrichment
                }
            />,
        );

        const field = screen.getByLabelText('dataSource *');
        expect(field).toBeInTheDocument();
        expect(field).toHaveValue('dataset');
        expect(
            screen.queryByText('error_field_required'),
        ).not.toBeInTheDocument();

        await act(async () => {
            fireEvent.click(
                within(
                    screen.getByRole('group', {
                        name: 'aria-group-dataSource',
                    }),
                ).getByLabelText('Clear'),
            );
        });

        await waitFor(() => {
            expect(
                screen.getByText('error_field_required'),
            ).toBeInTheDocument();
        });
    });

    it('should require the sourceColumn field', async () => {
        const screen = render(
            <EnrichmentForm
                {...defaultProps}
                initialValues={
                    {
                        dataSource: 'dataset',
                        sourceColumn: 'field1',
                    } as unknown as Enrichment
                }
            />,
        );

        const field = screen.getByLabelText('sourceColumn *');
        expect(field).toBeInTheDocument();
        expect(field).toHaveValue('field1');
        expect(
            screen.queryByText('error_field_required'),
        ).not.toBeInTheDocument();

        await act(async () => {
            fireEvent.click(
                within(
                    screen.getByRole('group', {
                        name: 'aria-group-sourceColumn',
                    }),
                ).getByLabelText('Clear'),
            );
        });

        await waitFor(() => {
            expect(
                screen.getByText('error_field_required'),
            ).toBeInTheDocument();
        });
    });

    it('should support to select precomputed data source', async () => {
        jest.mocked(createEnrichment).mockResolvedValue({ response: {} });

        const screen = render(<EnrichmentForm {...defaultProps} />);

        await act(async () => {
            fireEvent.change(screen.getByLabelText('fieldName *'), {
                target: { value: 'enrichment' },
            });
        });

        await act(async () => {
            fireEvent.change(screen.getByLabelText('webServiceUrl *'), {
                target: { value: '//test' },
            });
        });

        const dataSourceField = screen.getByLabelText('dataSource *');
        expect(dataSourceField).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(dataSourceField, {
                target: { value: 'Precomputed 2' },
            });
            fireEvent.keyDown(dataSourceField, { key: 'ArrowDown' });
            fireEvent.keyDown(dataSourceField, { key: 'Enter' });
        });

        await waitFor(() => {
            expect(dataSourceField).toHaveValue('Precomputed 2');
        });

        const sourceColumnField = screen.getByLabelText('sourceColumn *');
        expect(sourceColumnField).toBeInTheDocument();

        await waitFor(() => {
            expect(sourceColumnField).not.toBeDisabled();
        });

        await act(async () => {
            fireEvent.change(sourceColumnField, {
                target: { value: 'id' },
            });

            fireEvent.keyDown(sourceColumnField, { key: 'ArrowDown' });
            fireEvent.keyDown(sourceColumnField, { key: 'Enter' });
        });

        await waitFor(() => {
            expect(sourceColumnField).toHaveValue('id');
        });

        const submitButton = screen.getByText('save');
        expect(submitButton).toBeInTheDocument();

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(createEnrichment).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'enrichment',
                    webServiceUrl: '//test',
                    dataSource: 'precomputed2',
                    sourceColumn: 'id',
                }),
            );
        });
    });
});
