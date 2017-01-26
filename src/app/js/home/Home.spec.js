import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import CircularProgress from 'material-ui/CircularProgress';

import { HomeComponent as Home } from './Home';
import Dataset from '../dataset/Dataset';
import NoDataset from '../publication/NoDataset';

describe('<Home />', () => {
    it('should call loadPublication on mount', () => {
        const loadPublication = createSpy();

        shallow(<Home
            p={{ t: key => key }}
            loading
            loadPublication={loadPublication}
        />);

        expect(loadPublication).toHaveBeenCalled();
    });

    it('should render a CircularProgress if loading', () => {
        const wrapper = shallow(<Home
            p={{ t: key => key }}
            loading
            loadPublication={() => {}}
        />);

        const loading = wrapper.find(CircularProgress);
        expect(loading.length).toEqual(1);
    });

    it('should render a Dataset component if one is present', () => {
        const wrapper = shallow(<Home
            p={{ t: key => key }}
            hasPublishedDataset
            loadPublication={() => {}}
        />);

        const component = wrapper.find(Dataset);
        expect(component.length).toEqual(1);
    });

    it('should render a NoDataset component if no dataset present', () => {
        const wrapper = shallow(<Home
            p={{ t: key => key }}
            hasPublishedDataset={false}
            loadPublication={() => {}}
        />);

        const component = wrapper.find(NoDataset);
        expect(component.length).toEqual(1);
    });
});
