import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

import Loading from '../../lib/Loading';
import { ResourceComponent } from './Resource';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';

describe('<Resource />', () => {
    it('should display Loading if loading prop is true', () => {
        const props = {
            loading: true,
            p: { t: () => {} },
        };

        const wrapper = shallow(<ResourceComponent
            {...props}
        />);
        expect(wrapper.find(Loading).length).toEqual(1);
    });

    it('should display not found message if no resource', () => {
        const props = {
            loading: false,
            p: { t: () => {} },
        };

        const wrapper = shallow(<ResourceComponent
            {...props}
        />);
        expect(wrapper.find(Loading).length).toEqual(0);
        expect(wrapper.find('.not-found').length).toEqual(1);
    });

    it('should display Detail if resource', () => {
        const props = {
            loading: false,
            resource: 'resource',
            p: { t: () => {} },
        };

        const wrapper = shallow(<ResourceComponent
            {...props}
        />);
        expect(wrapper.find(Loading).length).toEqual(0);
        expect(wrapper.find('.not-found').length).toEqual(0);
        expect(wrapper.find(Detail).length).toEqual(1);
    });

    it('should display RemovedDetail if resource and mode is removed', () => {
        const props = {
            mode: 'removed',
            loading: false,
            resource: 'resource',
            p: { t: () => {} },
        };

        const wrapper = shallow(<ResourceComponent
            {...props}
        />);
        expect(wrapper.find(RemovedDetail).length).toEqual(1);
        expect(wrapper.find(Detail).length).toEqual(0);
    });

    it('should display back to list in link if no datasetTitle', () => {
        const props = {
            loading: false,
            resource: 'resource',
            datasetTitle: null,
            p: { t: v => v },
        };

        const wrapper = shallow(<ResourceComponent
            {...props}
        />);
        const link = wrapper.find(FlatButton).at(0);
        expect(link.prop('label')).toEqual('back_to_list');
    });

    it('should display datasetTitle in link', () => {
        const props = {
            loading: false,
            resource: 'resource',
            datasetTitleKey: 'dataset_title',
            characteristics: { dataset_title: 'dataset title' },
            p: { t: v => v },
        };

        const wrapper = shallow(<ResourceComponent
            {...props}
        />);
        const link = wrapper.find(FlatButton).at(0);
        expect(link.prop('label')).toEqual('dataset title');
    });
});
