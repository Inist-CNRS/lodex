import React from 'react';
import { shallow } from 'enzyme';

import Loading from '../../lib/components/Loading';
import { ResourceComponent } from './Resource';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { render } from '../../../../test-utils';

describe('<Resource />', () => {
    const defaultProps = {
        loading: true,
        preLoadResource: () => null,
        preLoadPublication: () => null,
        preLoadExporters: () => null,
        p: { t: (v) => v },
        history: { goBack: () => {} },
        match: { params: { uri: 'FOO' } },
    };

    it('should display Loading if loading prop is true', () => {
        const props = {
            ...defaultProps,
            loading: true,
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Loading)).toHaveLength(1);
    });

    it('should display not found message if no resource', () => {
        const props = {
            ...defaultProps,
            loading: false,
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Loading)).toHaveLength(0);
        expect(wrapper.find('.not-found')).toHaveLength(1);
    });

    it('should display Detail if resource', () => {
        const props = {
            ...defaultProps,
            loading: false,
            resource: 'resource',
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Loading)).toHaveLength(0);
        expect(wrapper.find('.not-found')).toHaveLength(0);
        expect(wrapper.find(Detail)).toHaveLength(1);
    });

    it('should display RemovedDetail if resource is removed', () => {
        const props = {
            ...defaultProps,
            removed: true,
            loading: false,
            resource: 'resource',
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(RemovedDetail)).toHaveLength(1);
        expect(wrapper.find(Detail)).toHaveLength(0);
    });

    it('should display back to list in link if no datasetTitle', () => {
        const props = {
            ...defaultProps,
            loading: false,
            resource: 'resource',
            datasetTitle: null,
        };

        const wrapper = shallow(<ResourceComponent {...props} />);
        expect(wrapper.find(Detail).prop('backToListLabel')).toBe(
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
        expect(wrapper.find(Detail).prop('backToListLabel')).toBe(
            'dataset title',
        );
    });

    it('should call preLoadExporters when the resource component will mount', () => {
        const preLoadExporters = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { uri: 'uri' } },
            preLoadExporters,
            loading: false,
            resource: 'resource',
        };

        render(<ResourceComponent {...props} />);
        expect(preLoadExporters).toHaveBeenCalledTimes(1);
    });

    it('should call again preLoadResource if the uid uri change in the url', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { uri: 'uri' } },
            preLoadResource,
            loading: false,
            resource: 'resource',
        };

        const { rerender } = render(<ResourceComponent {...props} />);
        expect(preLoadResource).toHaveBeenCalledTimes(1);

        rerender(
            <ResourceComponent
                {...props}
                match={{ params: { uri: 'changed' } }}
            />,
        );
        expect(preLoadResource).toHaveBeenCalledTimes(2);
    });

    it('should call again preLoadResource if the ark uri change in the url', () => {
        const preLoadResource = jest.fn();
        const props = {
            ...defaultProps,
            match: { params: { naan: 'naan', rest: 'rest' } },
            preLoadResource,
            loading: false,
            resource: 'resource',
        };

        const { rerender } = render(<ResourceComponent {...props} />);
        expect(preLoadResource).toHaveBeenCalledTimes(1);

        rerender(
            <ResourceComponent
                {...props}
                match={{ params: { naan: 'naan', rest: 'changed' } }}
            />,
        );

        expect(preLoadResource).toHaveBeenCalledTimes(2);
    });
});
