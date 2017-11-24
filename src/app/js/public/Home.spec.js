import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';

import { HomeComponent as Home } from './Home';
import Loading from '../lib/components/Loading';
import Dataset from './dataset/Dataset';
import NoDataset from './NoDataset';

describe('<Home />', () => {
    it('should call preLoadPublication on mount', () => {
        const preLoadPublication = createSpy();

        shallow(
            <Home
                p={{ t: key => key }}
                loading
                preLoadPublication={preLoadPublication}
            />,
        );

        expect(preLoadPublication).toHaveBeenCalled();
    });

    it('should render Loading if loading', () => {
        const wrapper = shallow(
            <Home
                p={{ t: key => key }}
                loading
                preLoadPublication={() => {}}
            />,
        );

        const loading = wrapper.find(Loading);
        expect(loading.length).toEqual(1);
    });

    it('should render a Dataset component if one is present', () => {
        const wrapper = shallow(
            <Home
                p={{ t: key => key }}
                hasPublishedDataset
                preLoadPublication={() => {}}
            />,
        );

        const component = wrapper.find(Dataset);
        expect(component.length).toEqual(1);
    });

    it('should render a NoDataset component if no dataset present', () => {
        const wrapper = shallow(
            <Home
                p={{ t: key => key }}
                hasPublishedDataset={false}
                preLoadPublication={() => {}}
            />,
        );

        const component = wrapper.find(NoDataset);
        expect(component.length).toEqual(1);
    });
});
