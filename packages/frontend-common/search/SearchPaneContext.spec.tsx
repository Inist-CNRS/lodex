import {
    act,
    fireEvent,
    render,
    waitFor,
    within,
} from '@testing-library/react';
import { MemoryRouter, useHistory } from 'react-router-dom';
import { SearchPaneContextProvider } from './SearchPaneContext';
import { useSearchPaneContext } from './useSearchPaneContext';

function TestContent() {
    const { setFilter } = useSearchPaneContext();
    const history = useHistory();

    return (
        <>
            <button
                type="button"
                onClick={() =>
                    setFilter({
                        field: 'testColumn',
                        value: 'testValue',
                    })
                }
            >
                Set Filter
            </button>
            <button type="button" onClick={() => history.push('/page2')}>
                Navigate to /page2
            </button>
        </>
    );
}

function TestResultsPane() {
    const { filter, setFilter } = useSearchPaneContext();

    return (
        <dialog open={!!filter}>
            <button type="button" onClick={() => setFilter(null)}>
                Clear Filter
            </button>
            <dl role="group" aria-label={filter?.field}>
                <dt role="listitem">{filter?.field}</dt>
                <dd>{JSON.stringify(filter?.value)}</dd>
            </dl>
        </dialog>
    );
}

describe('SearchPaneContext', () => {
    it('sould not render the resultsPane when filter is null', () => {
        const screen = render(
            <MemoryRouter>
                <SearchPaneContextProvider resultsPane={<TestResultsPane />}>
                    <TestContent />
                </SearchPaneContextProvider>
            </MemoryRouter>,
        );

        expect(screen.queryByRole('definition')).toBeNull();
    });

    it('should render the resultsPane when filter is set', async () => {
        const screen = render(
            <MemoryRouter>
                <SearchPaneContextProvider resultsPane={<TestResultsPane />}>
                    <TestContent />
                </SearchPaneContextProvider>
            </MemoryRouter>,
        );

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Set Filter' }));
        });

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeVisible();
        });

        const group = screen.getByRole('group', {
            name: 'testColumn',
        });

        expect(group).toBeVisible();

        expect(within(group).getByRole('listitem')).toHaveTextContent(
            'testColumn',
        );
        expect(within(group).getByRole('definition')).toHaveTextContent(
            '"testValue"',
        );
    });

    it('should hide modal when clearing filters', async () => {
        const screen = render(
            <MemoryRouter>
                <SearchPaneContextProvider resultsPane={<TestResultsPane />}>
                    <TestContent />
                </SearchPaneContextProvider>
            </MemoryRouter>,
        );

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Set Filter' }));
        });

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeVisible();
        });

        act(() => {
            fireEvent.click(
                screen.getByRole('button', {
                    name: 'Clear Filter',
                }),
            );
        });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('should reset filters on page change', async () => {
        const screen = render(
            <MemoryRouter initialEntries={['/page1']}>
                <SearchPaneContextProvider resultsPane={<TestResultsPane />}>
                    <TestContent />
                </SearchPaneContextProvider>
            </MemoryRouter>,
        );

        // Set a filter
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Set Filter' }));
        });

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeVisible();
        });

        // Navigate to a different page
        act(() => {
            fireEvent.click(
                screen.getByRole('button', { name: 'Navigate to /page2' }),
            );
        });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});
