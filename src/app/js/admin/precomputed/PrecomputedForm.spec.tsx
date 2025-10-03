import '@testing-library/jest-dom';
import { render } from '../../../../test-utils';

import { PrecomputedForm, type PrecomputedFormProps } from './PrecomputedForm';

const defaultProps: PrecomputedFormProps = {
    datasetFields: ['field1', 'field2'],
    formValues: {
        name: '',
        webServiceUrl: '',
        sourceColumns: [],
        subPath: '',
    },
    history: { push: jest.fn() },
    onLaunchPrecomputed: jest.fn(),
    onLoadPrecomputedData: jest.fn(),
    isPrecomputedRunning: false,
    handleSubmit: jest.fn(),
    submitting: false,
};

describe('<PrecomputedForm />', () => {
    it('renders the name field', () => {
        const screen = render(<PrecomputedForm {...defaultProps} />);
        expect(screen.getByLabelText('fieldName *')).toBeInTheDocument();
    });

    it('renders the webServiceUrl field', () => {
        const screen = render(<PrecomputedForm {...defaultProps} />);
        expect(screen.getByLabelText('webServiceUrl *')).toBeInTheDocument();
    });

    it('renders the sourceColumns field', () => {
        const screen = render(<PrecomputedForm {...defaultProps} />);
        expect(screen.getByLabelText('sourceColumns *')).toBeInTheDocument();
    });

    it('renders the logs dialog button in edit mode', () => {
        const screen = render(
            <PrecomputedForm
                {...defaultProps}
                initialValues={{
                    _id: '123',
                    status: 'IN_PROGRESS',
                    data: {},
                    name: 'test',
                    jobId: 'job_123',
                    webServiceUrl: 'http://example.com',
                    sourceColumns: ['field1'],
                    subPath: '',
                    startedAt: '2025-01-01',
                }}
            />,
        );
        expect(screen.getByText(/see_logs/i)).toBeInTheDocument();
    });
});
