import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';

import { HomeComponent as Home } from './Home';
import Loading from '../lib/components/Loading';
import GraphList from './graph/GraphList';
import NoDataset from './NoDataset';

describe('<Home />', () => {
    it('should call preLoadPublication on mount', () => {
        const preLoadPublication = createSpy();
        const preLoadDatasetPage = createSpy();
        const preLoadExporters = createSpy();

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

    it('should render a GraphList component if dataset is present', () => {
        const wrapper = shallow(
            <Home
                p={{ t: key => key }}
                hasPublishedDataset
                preLoadPublication={() => {}}
                preLoadDatasetPage={() => {}}
                preLoadExporters={() => {}}
            />,
        );

        const component = wrapper.find(GraphList);
        expect(component.length).toEqual(1);
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
