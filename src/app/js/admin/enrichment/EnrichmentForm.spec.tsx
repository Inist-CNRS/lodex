import { act } from 'react-dom/test-utils';
import { render } from '../../../../test-utils';
import { EnrichmentForm, type EnrichmentFormProps } from './EnrichmentForm';
import type { Enrichment } from '.';

const EXCERPT_LINES = [{ columnOne: 'TEST' }];

const Noop = () => <></>;
jest.mock('./EnrichmentStatus', () => Noop);
jest.mock('./RunButton', () => Noop);
jest.mock('../api/job', () => ({
    getJobLogs: () =>
        Promise.resolve({
            response: { logs: [] },
        }),
}));

describe('<EnrichmentFormComponent />', () => {
    const defaultProps: EnrichmentFormProps = {
        datasetFields: ['field1', 'field2'],
        excerptLines: EXCERPT_LINES,
        history: {
            push: jest.fn(),
        },
        onLoadEnrichments: jest.fn(),
        onRetryEnrichment: jest.fn(),
        onLaunchEnrichment: jest.fn(),
        match: '/enrichment/123',
    };

    it('should render form', () => {
        const screen = render(<EnrichmentForm {...defaultProps} />);

        const nameField = screen.getByLabelText('fieldName *');
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue('');

        const webServiceUrlField = screen.getByLabelText('webServiceUrl *');
        expect(webServiceUrlField).toBeInTheDocument();
        expect(webServiceUrlField).toHaveValue('');

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

        const sourceColumnField = screen.getByLabelText('sourceColumn *');
        expect(sourceColumnField).toBeInTheDocument();
        expect(sourceColumnField).toHaveValue('field1');

        const subPathField = screen.getByLabelText('subPath');
        expect(subPathField).toBeInTheDocument();
        expect(subPathField).toHaveValue('/test');

        const submitButton = screen.getByText('save');
        expect(submitButton).toBeInTheDocument();
        await screen.waitFor(() => {
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
            screen.fireEvent.change(nameField, { target: { value: '' } });
        });

        await screen.waitFor(() => {
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
            screen.fireEvent.change(field, { target: { value: '' } });
        });

        await screen.waitFor(() => {
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
                    { sourceColumn: 'field1' } as unknown as Enrichment
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
            screen.fireEvent.click(screen.getByLabelText('Clear'));
        });

        await screen.waitFor(() => {
            expect(
                screen.getByText('error_field_required'),
            ).toBeInTheDocument();
        });
    });
});
