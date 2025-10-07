import { render } from '../../../../test-utils';
import { EnrichmentForm } from './EnrichmentForm';

const EXCERPT_LINES = [{ columnOne: 'TEST' }];

describe('<EnrichmentFormComponent />', () => {
    const defaultProps = {
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

        const sourceColumnField = screen.getByLabelText('sourceColumn');
        expect(sourceColumnField).toBeInTheDocument();
        expect(sourceColumnField).toHaveValue('');

        const webServiceUrlField = screen.getByLabelText('webServiceUrl *');
        expect(webServiceUrlField).toBeInTheDocument();
        expect(webServiceUrlField).toHaveValue('');

        const ruleField = screen.getByLabelText('rule');
        expect(ruleField).toBeInTheDocument();
        expect(ruleField).toHaveValue('');

        const subPathField = screen.getByLabelText('subPath');
        expect(subPathField).toBeInTheDocument();
        expect(subPathField).toHaveValue('');

        const submitButton = screen.getByText('Launch enrichment');
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    // it('should render enrichment logs dialog in edit mode', () => {
    //     const initialValues = {
    //         advancedMode: false,
    //         _id: '123',
    //         status: 'IN_PROGRESS' as const,
    //         name: 'Test Enrichment',
    //         sourceColumn: '',
    //         subPath: '',
    //         rule: '',
    //         webServiceUrl: '',
    //         jobId: 'job123',
    //         errorCount: 0,
    //     };

    //     const propsWithEdit = {
    //         ...defaultProps,
    //         initialValues,
    //         status: 'IN_PROGRESS' as const,
    //     };

    //     const screen = render(<EnrichmentForm {...propsWithEdit} />);

    //     // Should render logs dialog (mocked component)
    //     expect(
    //         screen.getByTestId('enrichment-logs-dialog'),
    //     ).toBeInTheDocument();

    //     // Should render status and delete button in edit mode
    //     expect(screen.getByTestId('enrichment-status')).toBeInTheDocument();
    //     expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    // });
});
