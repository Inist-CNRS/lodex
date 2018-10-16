import React from 'react';
import { shallow } from 'enzyme';

import Loading from '../../lib/components/Loading';
import { ResourceComponent } from './Resource';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';

describe('<Resource />', () => {
    const defaultProps = {
        loading: true,
        preLoadResource: () => null,
        preLoadPublication: () => null,
        p: { t: v => v },
        match: {},
    };

    it('should display Loading if loading prop is true', () => {
        const props = {
            ...defaultProps,
            loading: true,
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Loading).length).toEqual(1);
    });

    it('should display not found message if no resource', () => {
        const props = {
            ...defaultProps,
            loading: false,
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Loading).length).toEqual(0);
        expect(wrapper.find('.not-found').length).toEqual(1);
    });

    it('should display Detail if resource', () => {
        const props = {
            ...defaultProps,
            loading: false,
            resource: 'resource',
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Loading).length).toEqual(0);
        expect(wrapper.find('.not-found').length).toEqual(0);
        expect(wrapper.find(Detail).length).toEqual(1);
    });

    it('should display RemovedDetail if resource is removed', () => {
        const props = {
            ...defaultProps,
            removed: true,
            loading: false,
            resource: 'resource',
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(RemovedDetail).length).toEqual(1);
        expect(wrapper.find(Detail).length).toEqual(0);
    });

    it('should display back to list in link if no datasetTitle', () => {
        const props = {
            ...defaultProps,
            loading: false,
            resource: 'resource',
            datasetTitle: null,
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Detail).prop('backToListLabel')).toEqual(
            'back_to_list',
        );
    });

    it('should display datasetTitle in link', () => {
        const props = {
            ...defaultProps,
            loading: false,
            resource: 'resource',
            datasetTitleKey: 'dataset_title',
            characteristics: { dataset_title: 'dataset title' },
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Detail).prop('backToListLabel')).toEqual(
            'dataset title',
        );
    });

    it('should call again preLoadResource if the uri change in the url', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            preLoadResource,
            loading: false,
            resource: 'resource',
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(preLoadResource).toHaveBeenCalledTimes(1);

        wrapper.setProps({ ...props, match: { params: { uri: 'changed' } } });
        expect(preLoadResource).toHaveBeenCalledTimes(2);
    });
});
