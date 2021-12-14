import React from 'react';
import { shallow } from 'enzyme';

import { EnrichmentExcerptComponent } from './EnrichmentExcerpt';
import { TableContainer } from '@material-ui/core';

describe('<EnrichmentExcerpt />', () => {
    it('should render a tableContainer', () => {
        const wrapper = shallow(
            <EnrichmentExcerptComponent lines={[]} p={{ t: () => {} }} />,
        );
        const tableContainer = wrapper.find(TableContainer);
        expect(tableContainer.exists()).toBeTruthy();
    });
});
