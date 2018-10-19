import React from 'react';
import { shallow } from 'enzyme';
import CircularProgress from 'material-ui/CircularProgress';

import FetchIstex from './FetchIstex';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';

describe('FetchIstex', () => {
    const defaultProps = {
        getData: jest.fn(() => Promise.resolve(null)),
        children: jest.fn(() => <div id="children">children</div>),
        polyglot: { t: v => v },
    };

    it('should call getData on mount', () => {
        shallow(<FetchIstex {...defaultProps} />);

        expect(defaultProps.getData).toHaveBeenCalled();
    });

    it('should display circularProgress', () => {
        const wrapper = shallow(<FetchIstex {...defaultProps} />);

        expect(wrapper.find(CircularProgress)).toHaveLength(1);
        expect(wrapper.find(AdminOnlyAlert)).toHaveLength(0);
    });

    it('should display display children once data have loaded', async () => {
        const dataPromise = Promise.resolve('data');
        const getData = jest.fn(() => dataPromise);
        const wrapper = shallow(
            <FetchIstex {...defaultProps} getData={getData} />,
        );

        expect(wrapper.find(CircularProgress)).toHaveLength(1);
        await dataPromise; // // wait for dataPromise to be resolveda by component
        wrapper.update();
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        expect(wrapper.find(AdminOnlyAlert)).toHaveLength(0);
        expect(wrapper.find('#children')).toHaveLength(1);
        expect(defaultProps.children).toHaveBeenCalledWith({
            ...defaultProps,
            getData,
            data: 'data',
        });
    });

    it('should display AdminOnlyAlert if getData rejected', async () => {
        const dataPromise = Promise.reject(new Error('Boom'));
        const getData = jest.fn(() => dataPromise);
        const wrapper = shallow(
            <FetchIstex {...defaultProps} getData={getData} />,
        );

        expect(wrapper.find(CircularProgress)).toHaveLength(1);
        await dataPromise.catch(v => v); // // wait for dataPromise to be resolveda by component
        wrapper.update();
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        expect(wrapper.find('#children')).toHaveLength(0);
        expect(defaultProps.children).toHaveBeenCalledTimes(0);
        expect(wrapper.find(AdminOnlyAlert)).toHaveLength(1);
    });

    afterEach(() => {
        defaultProps.children.mockClear();
        defaultProps.getData.mockClear();
    });
});
