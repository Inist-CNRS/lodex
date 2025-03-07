import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '../../../../test-utils';
import { ParsingResultComponent } from './ParsingResult';

jest.mock('../api/dataset', () => ({
    getDatasetColumns: jest.fn(() => Promise.resolve({ columns: [] })),
    getDataset: jest.fn(() => Promise.resolve({ count: 0, datas: [] })),
}));

describe('<ParsingResult />', () => {
    it('should render the DataGrid', () => {
        const wrapper = render(
            <MemoryRouter initialEntries={['/data/existing']} initialIndex={0}>
                <Route
                    exact
                    path="/data/existing"
                    render={() => (
                        <ParsingResultComponent
                            enrichments={[]}
                            p={{ t: () => {} }}
                            loadingParsingResult={false}
                        />
                    )}
                />
            </MemoryRouter>,
        );
        const dataGrid = wrapper.getByRole('grid');
        expect(dataGrid).toBeInTheDocument();
    });
});
