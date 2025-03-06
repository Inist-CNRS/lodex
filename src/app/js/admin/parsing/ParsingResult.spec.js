import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '../../../../test-utils';
import { ParsingResultComponent as ParsingResult } from './ParsingResult';

jest.mock('../api/dataset');

describe('<ParsingResult />', () => {
    it('should render the DataGrid', () => {
        const wrapper = render(
            <MemoryRouter initialEntries={['/data/existing']} initialIndex={0}>
                <Route
                    exact
                    path="/data/existing"
                    render={() => (
                        <ParsingResult
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
