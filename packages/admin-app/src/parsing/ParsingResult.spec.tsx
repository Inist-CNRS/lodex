import { MemoryRouter, Route } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import { render } from '../test-utils';
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

    it('should refetch the columns when an enrichment ends, as it adds keys without adding lines', async () => {
        const renderWithStatus = (status: string) => (
            <MemoryRouter initialEntries={['/data/existing']} initialIndex={0}>
                <ParsingResultComponent
                    enrichments={[{ name: 'enriched', status }]}
                    loadingParsingResult={false}
                    totalLoadedLines={100}
                />
            </MemoryRouter>
        );
        const screen = render(renderWithStatus('IN_PROGRESS'));
        await waitFor(() =>
            expect(datasetApi.getDataColumns).toHaveBeenCalled(),
        );
        (datasetApi.getDataColumns as jest.Mock).mockClear();
        screen.rerender(renderWithStatus('FINISHED'));
        await waitFor(() =>
            expect(datasetApi.getDataColumns).toHaveBeenCalledTimes(1),
        );
    });
});
