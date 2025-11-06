import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, userEvent } from '../test-utils';
import { PreComputationSelector } from './PreComputationSelector';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { TaskStatus, type TaskStatusType } from '@lodex/common';
import { waitFor } from '@testing-library/dom';

jest.mock('@lodex/frontend-common/fetch/fetch');

describe('PreComputationSelector', () => {
    it('should render all precomputation disabling those that are not done', async () => {
        const user = userEvent.setup();
        const queryClient = new QueryClient();
        const precomputations: {
            _id: string;
            name: string;
            status: TaskStatusType | '';
        }[] = [
            {
                _id: 'precomp1',
                name: 'Precomp 1',
                status: '',
            },
            {
                _id: 'precomp2',
                name: 'Precomp 2',
                status: TaskStatus.FINISHED,
            },
            {
                _id: 'precomp3',
                name: 'Precomp 3',
                status: TaskStatus.CANCELED,
            },
            {
                _id: 'precomp4',
                name: 'Precomp 4',
                status: TaskStatus.ERROR,
            },
            {
                _id: 'precomp5',
                name: 'Precomp 5',
                status: TaskStatus.IN_PROGRESS,
            },
            {
                _id: 'precomp6',
                name: 'Precomp 6',
                status: TaskStatus.ON_HOLD,
            },
            {
                _id: 'precomp7',
                name: 'Precomp 7',
                status: TaskStatus.PAUSED,
            },
            {
                _id: 'precomp8',
                name: 'Precomp 8',
                status: TaskStatus.PENDING,
            },
        ];
        const expectedValues = [
            {
                label: 'Precomp 1 (enrichment_status_not_started)',
                disabled: true,
            },
            { label: 'Precomp 2 (enrichment_status_done)', disabled: false },
            {
                label: 'Precomp 3 (enrichment_status_canceled)',
                disabled: true,
            },
            { label: 'Precomp 4 (enrichment_status_error)', disabled: true },
            {
                label: 'Precomp 5 (enrichment_status_running)',
                disabled: true,
            },
            { label: 'Precomp 6 (enrichment_status_paused)', disabled: true },
            { label: 'Precomp 7 (enrichment_status_paused)', disabled: true },
            {
                label: 'Precomp 8 (enrichment_status_pending)',
                disabled: true,
            },
        ];
        jest.mocked(fetch).mockResolvedValueOnce({
            response: precomputations,
        });
        const screen = render(
            <QueryClientProvider client={queryClient}>
                <PreComputationSelector
                    disabled={false}
                    value={null}
                    onChange={() => {}}
                />
            </QueryClientProvider>,
        );

        await waitFor(() =>
            expect(
                screen.getByLabelText('select_precomputed_data'),
            ).toBeInTheDocument(),
        );

        await waitFor(() =>
            expect(
                screen.getByLabelText('select_precomputed_data'),
            ).not.toBeDisabled(),
        );

        user.click(screen.getByRole('combobox'));
        await waitFor(() =>
            expect(screen.getByRole('listbox')).toBeInTheDocument(),
        );
        expect(screen.getAllByRole('option')).toHaveLength(8);
        screen.getAllByRole('option').forEach((option, i) => {
            expect(option).toHaveTextContent(expectedValues[i].label);

            expectedValues[i].disabled
                ? expect(option).toHaveAttribute('aria-disabled', 'true')
                : expect(option).not.toHaveAttribute('aria-disabled');
        });
    });
});
