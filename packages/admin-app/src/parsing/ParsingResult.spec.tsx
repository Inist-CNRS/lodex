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

    it('should refetch the dataset once the parsing result is reloaded', async () => {
        const renderWithLoading = (loadingParsingResult: boolean) => (
            <MemoryRouter initialEntries={['/data/existing']} initialIndex={0}>
                <ParsingResultComponent
                    enrichments={[]}
                    loadingParsingResult={loadingParsingResult}
                />
            </MemoryRouter>
        );
        const screen = render(renderWithLoading(false));
        await waitFor(() => expect(datasetApi.getData).toHaveBeenCalled());
        (datasetApi.getData as jest.Mock).mockClear();

        // the import ends: the parsing result is reloaded, the grid stays mounted
        screen.rerender(renderWithLoading(true));
        screen.rerender(renderWithLoading(false));

        await waitFor(() =>
            expect(datasetApi.getData).toHaveBeenCalledTimes(1),
        );
    });
});
