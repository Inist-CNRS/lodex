import { MemoryRouter, Route } from 'react-router-dom';
import { render as rawRender, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { getStore, render, Wrapper } from '../test-utils';
import { ParsingResultComponent } from './ParsingResult';
import datasetApi from '../api/dataset';

jest.mock('../api/dataset', () => ({
    getDataColumns: jest.fn(() => Promise.resolve({ columns: [] })),
    getData: jest.fn(() => Promise.resolve({ count: 0, datas: [] })),
}));

describe('<ParsingResult />', () => {
    it('should render the DataGrid', () => {
        const screen = render(
            <MemoryRouter initialEntries={['/data/existing']} initialIndex={0}>
                <Route
                    exact
                    path="/data/existing"
                    render={() => (
                        <ParsingResultComponent
                            enrichments={[]}
                            // @ts-expect-error TS2322
                            p={{ t: () => {} }}
                            loadingParsingResult={false}
                        />
                    )}
                />
            </MemoryRouter>,
        );
        const dataGrid = screen.getByRole('grid');
        expect(dataGrid).toBeInTheDocument();
    });

    it('should show the cached rows at once when the grid is mounted again', async () => {
        const client = new QueryClient();
        const store = getStore();
        const mountGrid = () =>
            rawRender(
                <Wrapper store={store} client={client}>
                    <ParsingResultComponent
                        enrichments={[]}
                        loadingParsingResult={false}
                        precomputedId="precomputed-id"
                    />
                </Wrapper>,
            );
        (datasetApi.getData as jest.Mock).mockResolvedValueOnce({
            count: 2,
            datas: [{ _id: '0' }, { _id: '1' }],
        });
        const firstMount = mountGrid();
        await waitFor(() =>
            expect(firstMount.getByRole('grid')).toHaveAttribute(
                'aria-rowcount',
                '2',
            ),
        );
        firstMount.unmount();

        // the background refresh never answers: the rows come from the cache
        (datasetApi.getData as jest.Mock).mockImplementationOnce(
            () => new Promise(() => {}),
        );
        const secondMount = mountGrid();
        expect(secondMount.getByRole('grid')).toHaveAttribute(
            'aria-rowcount',
            '2',
        );
    });

    describe('when the main dataset grows during an import', () => {
        const renderWithLines = (
            totalLoadedLines: number,
            precomputedId?: string,
        ) => (
            <MemoryRouter initialEntries={['/data/existing']} initialIndex={0}>
                <ParsingResultComponent
                    enrichments={[]}
                    loadingParsingResult={false}
                    totalLoadedLines={totalLoadedLines}
                    precomputedId={precomputedId}
                />
            </MemoryRouter>
        );

        const growDataset = async (precomputedId?: string) => {
            // the grid mounts mid-import, then the import ends with more lines
            const screen = render(renderWithLines(100, precomputedId));
            await waitFor(() => expect(datasetApi.getData).toHaveBeenCalled());
            (datasetApi.getData as jest.Mock).mockClear();
            (datasetApi.getDataColumns as jest.Mock).mockClear();
            screen.rerender(renderWithLines(500, precomputedId));
        };

        it('should refetch the rows and their count', async () => {
            await growDataset();
            await waitFor(() =>
                expect(datasetApi.getData).toHaveBeenCalledTimes(1),
            );
        });

        it('should refetch the columns, as the new lines may bring new keys', async () => {
            await growDataset();
            await waitFor(() =>
                expect(datasetApi.getDataColumns).toHaveBeenCalledTimes(1),
            );
        });

        it('should not refetch a precomputed grid', async () => {
            await growDataset('precomputed-id');
            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(datasetApi.getData).not.toHaveBeenCalled();
            expect(datasetApi.getDataColumns).not.toHaveBeenCalled();
        });
    });

    describe('when the enrichments change', () => {
        const renderWithEnrichments = (
            enrichments: object[],
            loadingEnrichments = false,
        ) => (
            <MemoryRouter initialEntries={['/data/existing']} initialIndex={0}>
                <ParsingResultComponent
                    enrichments={enrichments}
                    loadingEnrichments={loadingEnrichments}
                    loadingParsingResult={false}
                    totalLoadedLines={100}
                />
            </MemoryRouter>
        );

        const mountThenRerender = async (
            before: [object[], boolean?],
            after: [object[], boolean?],
        ) => {
            const screen = render(renderWithEnrichments(...before));
            await waitFor(() =>
                expect(datasetApi.getDataColumns).toHaveBeenCalled(),
            );
            (datasetApi.getData as jest.Mock).mockClear();
            (datasetApi.getDataColumns as jest.Mock).mockClear();
            screen.rerender(renderWithEnrichments(...after));
            return screen;
        };

        it('should refetch the columns and rows when an enrichment ends, as it adds keys without adding lines', async () => {
            await mountThenRerender(
                [[{ name: 'enriched', status: 'IN_PROGRESS' }]],
                [[{ name: 'enriched', status: 'FINISHED' }]],
            );
            await waitFor(() =>
                expect(datasetApi.getDataColumns).toHaveBeenCalledTimes(1),
            );
            expect(datasetApi.getData).toHaveBeenCalledTimes(1);
        });

        it('should not refetch on the first load of the enrichments, as the grid fetched both when it mounted', async () => {
            await mountThenRerender(
                [[], true],
                [[{ name: 'enriched', status: 'FINISHED' }]],
            );
            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(datasetApi.getDataColumns).not.toHaveBeenCalled();
            expect(datasetApi.getData).not.toHaveBeenCalled();
        });

        it('should show the rows of the last request when an older one answers last', async () => {
            const answer = (rows: number, delay: number) => () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                count: rows,
                                datas: Array.from({ length: rows }, (_, i) => ({
                                    _id: `${i}`,
                                })),
                            }),
                        delay,
                    ),
                );
            const screen = render(
                renderWithEnrichments([
                    { name: 'enriched', status: 'PENDING' },
                ]),
            );
            await new Promise((resolve) => setTimeout(resolve, 50));
            // two status changes: the first reload answers after the second
            (datasetApi.getData as jest.Mock)
                .mockImplementationOnce(answer(1, 200))
                .mockImplementationOnce(answer(3, 0));
            screen.rerender(
                renderWithEnrichments([
                    { name: 'enriched', status: 'IN_PROGRESS' },
                ]),
            );
            screen.rerender(
                renderWithEnrichments([
                    { name: 'enriched', status: 'FINISHED' },
                ]),
            );
            await new Promise((resolve) => setTimeout(resolve, 300));
            // the 3 rows of the last reload, not the 1 row of the first one
            expect(screen.getByRole('grid')).toHaveAttribute(
                'aria-rowcount',
                '3',
            );
        });

        it('should keep the current columns when their reload fails', async () => {
            (datasetApi.getDataColumns as jest.Mock)
                .mockResolvedValueOnce({
                    columns: [{ key: 'enriched', type: 'string' }],
                })
                .mockResolvedValueOnce({ columns: [], error: 'boom' });
            const screen = await mountThenRerender(
                [[{ name: 'enriched', status: 'IN_PROGRESS' }]],
                [[{ name: 'enriched', status: 'FINISHED' }]],
            );
            await waitFor(() =>
                expect(datasetApi.getDataColumns).toHaveBeenCalledTimes(1),
            );
            await new Promise((resolve) => setTimeout(resolve, 50));
            // the checkbox column and the "enriched" column
            expect(screen.getByRole('grid')).toHaveAttribute(
                'aria-colcount',
                '2',
            );
        });
    });
});
