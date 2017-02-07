import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import Loading from '../lib/Loading';
import { ResourceComponent } from './Resource';
import Detail from './Detail';
import DatasetCharacteristics from '../dataset/DatasetCharacteristics';

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

    it('should display Detail and DetailCharacteristic if resource', () => {
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
        expect(wrapper.find(DatasetCharacteristics).length).toEqual(1);
    });
});
