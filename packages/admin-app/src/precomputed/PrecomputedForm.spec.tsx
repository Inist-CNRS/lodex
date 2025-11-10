import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';

import { PrecomputedForm, type PrecomputedFormProps } from './PrecomputedForm';

jest.mock('../api/job', () => ({
    cancelJob: jest.fn(),
    clearJobs: jest.fn(),
    getJobLogs: jest.fn().mockResolvedValue({ response: { logs: [] } }),
}));

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
    match: { params: {} },
};

describe('<PrecomputedForm />', () => {
    it('renders the name field', () => {
        render(<PrecomputedForm {...defaultProps} />);
        expect(screen.getByLabelText('fieldName *')).toBeInTheDocument();
    });

    it('renders the webServiceUrl field', () => {
        render(<PrecomputedForm {...defaultProps} />);
        expect(screen.getByLabelText('webServiceUrl *')).toBeInTheDocument();
    });

    it('renders the sourceColumns field', () => {
        render(<PrecomputedForm {...defaultProps} />);
        expect(screen.getByLabelText('sourceColumns *')).toBeInTheDocument();
    });

    it('renders the logs dialog button in edit mode', () => {
        render(
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

    describe('RunButton', () => {
        it('renders the RunButton in edit mode', () => {
            render(
                <PrecomputedForm
                    {...defaultProps}
                    initialValues={{
                        _id: '123',
                        status: 'FINISHED',
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
            expect(
                screen.getByRole('button', { name: 'run' }),
            ).toBeInTheDocument();
        });

        it('opens a confirmation modal when RunButton is clicked', async () => {
            const user = userEvent.setup();
            render(
                <PrecomputedForm
                    {...defaultProps}
                    initialValues={{
                        _id: '123',
                        status: 'FINISHED',
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

            await act(() => {
                return user.click(screen.getByRole('button', { name: /run/i }));
            });

            await waitFor(() => {
                expect(
                    screen.getByRole('dialog', {
                        name: 'precomputed_confirm_run',
                    }),
                ).toBeVisible();
            });
        });

        it('closes the modal when cancel button is clicked', async () => {
            const user = userEvent.setup();
            render(
                <PrecomputedForm
                    {...defaultProps}
                    initialValues={{
                        _id: '123',
                        status: 'FINISHED',
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

            await act(() => {
                return user.click(screen.getByRole('button', { name: /run/i }));
            });

            await waitFor(() => {
                expect(
                    screen.getByRole('dialog', {
                        name: 'precomputed_confirm_run',
                    }),
                ).toBeVisible();
            });

            await act(() => {
                return user.click(
                    screen.getByRole('button', {
                        name: 'cancel',
                    }),
                );
            });

            await waitFor(() => {
                expect(
                    screen.queryByRole('dialog', {
                        name: 'precomputed_confirm_run',
                    }),
                ).not.toBeInTheDocument();
            });
        });

        it('calls onLaunchPrecomputed when confirm button is clicked', async () => {
            const user = userEvent.setup();
            const onLaunchPrecomputedMock = jest.fn();
            render(
                <PrecomputedForm
                    {...defaultProps}
                    onLaunchPrecomputed={onLaunchPrecomputedMock}
                    initialValues={{
                        _id: '123',
                        status: 'FINISHED',
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

            await act(() =>
                user.click(
                    screen.getByRole('button', {
                        name: 'run',
                    }),
                ),
            );

            await waitFor(() => {
                expect(
                    screen.getByRole('dialog', {
                        name: 'precomputed_confirm_run',
                    }),
                ).toBeVisible();
            });

            await act(() =>
                user.click(
                    screen.getByRole('button', {
                        name: 'confirm',
                    }),
                ),
            );

            await waitFor(() => {
                expect(onLaunchPrecomputedMock).toHaveBeenCalledWith({
                    id: '123',
                    action: 'relaunch',
                });
            });
        });

        it('disables RunButton when status is IN_PROGRESS', () => {
            render(
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

            const runButton = screen.getByRole('button', { name: 'run' });
            expect(runButton).toBeDisabled();
        });
    });
});
