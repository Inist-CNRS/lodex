import React from 'react';
import { shallow } from 'enzyme';
import { DataGrid } from '@mui/x-data-grid';

import { ParsingResultComponent as ParsingResult } from './ParsingResult';
jest.mock('../api/dataset');

describe('<ParsingResult />', () => {
    it('should render the DataGrid', () => {
        const wrapper = shallow(
            <ParsingResult
                enrichments={[]}
                p={{ t: () => {} }}
                loadingParsingResult={false}
            />,
        );
        const dataGrid = wrapper.find(DataGrid).at(0);
        expect(dataGrid).toHaveLength(1);
    });
});
