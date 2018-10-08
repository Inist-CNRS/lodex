import React from 'react';
import { shallow } from 'enzyme';

import { HomeComponent as Home } from './Home';
import Loading from '../lib/components/Loading';
import NoDataset from './NoDataset';

describe('<Home />', () => {
    it('should call preLoadPublication on mount', () => {
        const preLoadPublication = jest.fn();
        const preLoadDatasetPage = jest.fn();
        const preLoadExporters = jest.fn();

        shallow(
            <Home
                p={{ t: key => key }}
                loading
                preLoadPublication={preLoadPublication}
                preLoadDatasetPage={preLoadDatasetPage}
                preLoadExporters={preLoadExporters}
            />,
        );

        expect(preLoadPublication).toHaveBeenCalled();
        expect(preLoadDatasetPage).toHaveBeenCalled();
        expect(preLoadExporters).toHaveBeenCalled();
    });

    it('should render Loading if loading', () => {
        const wrapper = shallow(
            <Home
                p={{ t: key => key }}
                loading
                preLoadPublication={() => {}}
                preLoadDatasetPage={() => {}}
                preLoadExporters={() => {}}
            />,
        );

        const loading = wrapper.find(Loading);
        expect(loading.length).toEqual(1);
    });

    it('should render a NoDataset component if no dataset present', () => {
        const wrapper = shallow(
            <Home
                p={{ t: key => key }}
                hasPublishedDataset={false}
                preLoadPublication={() => {}}
                preLoadDatasetPage={() => {}}
                preLoadExporters={() => {}}
            />,
        );

        const component = wrapper.find(NoDataset);
        expect(component.length).toEqual(1);
    });
});
