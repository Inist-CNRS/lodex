import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '../test-utils';
import { ParsingResultComponent } from './ParsingResult';

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
});
