import React from 'react';
import { shallow } from 'enzyme';

import { EnrichmentExcerptComponent } from './EnrichmentExcerpt';
import { TableContainer, CircularProgress, TableCell } from '@material-ui/core';

describe('<EnrichmentExcerpt />', () => {
    it('should render a tableContainer', () => {
        const wrapper = shallow(
            <EnrichmentExcerptComponent lines={[]} p={{ t: () => {} }} />,
        );
        const tableContainer = wrapper.find(TableContainer);
        expect(tableContainer.exists()).toBeTruthy();
    });

    it('should render a tableContainer with a empty message', () => {
        const wrapper = shallow(
            <EnrichmentExcerptComponent lines={[]} p={{ t: () => {} }} />,
        );
        const tableContainer = wrapper.find(TableContainer);
        expect(tableContainer.exists()).toBeTruthy();

        const tableCell = wrapper.find(TableCell);
        expect(tableCell).toHaveLength(2); // 1 for the header and 1 for the empty message
    });

    it('should render a tableContainer with a two data', () => {
        const wrapper = shallow(
            <EnrichmentExcerptComponent
                lines={['test1', 'test2']}
                p={{ t: () => {} }}
            />,
        );
        const tableContainer = wrapper.find(TableContainer);
        expect(tableContainer.exists()).toBeTruthy();

        const tableCell = wrapper.find(TableCell);
        expect(tableCell).toHaveLength(3); // 1 for the header and 2 for the data
    });

    it('should render a tableContainer with a loading', () => {
        const wrapper = shallow(
            <EnrichmentExcerptComponent
                loading={true}
                lines={[]}
                p={{ t: () => {} }}
            />,
        );
        const tableContainer = wrapper.find(TableContainer);
        expect(tableContainer.exists()).toBeTruthy();

        const circularProgressContainer = wrapper.find(CircularProgress);
        expect(circularProgressContainer.exists()).toBeTruthy();
    });
});
