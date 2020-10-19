import React from 'react';
import { shallow } from 'enzyme';
import Folder from '@material-ui/icons/Folder';
import FolderOpen from '@material-ui/icons/FolderOpen';
import { CircularProgress, Button } from '@material-ui/core';
import { StyleSheetTestUtils } from 'aphrodite';

import FetchFold from './FetchFold';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';

describe('FetchFold', () => {
    const defaultProps = {
        getData: jest.fn(() => Promise.resolve({ hits: [] })),
        children: jest.fn(() => (
            <div className="children">rendered children</div>
        )),
        label: 'label',
        count: 10,
        polyglot: { t: v => v },
    };

    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
        defaultProps.children.mockClear();
    });

    it('should render closed', () => {
        const wrapper = shallow(<FetchFold {...defaultProps} />);
        expect(wrapper.find(Folder)).toHaveLength(1);
        expect(wrapper.find(FolderOpen)).toHaveLength(0);
        expect(wrapper.find('li')).toHaveLength(0);
        expect(defaultProps.children).toHaveBeenCalledTimes(0);
        expect(defaultProps.getData).toHaveBeenCalledTimes(0);
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        expect(wrapper.find('p')).toHaveLength(0);
    });

    it('should open and fetch data when clicking on button', async () => {
        const dataPromise = Promise.resolve({
            hits: [
                { name: 1, count: 10 },
                { name: 2, count: 20 },
                { name: 3, count: 30 },
            ],
        });
        const getData = jest.fn(() => dataPromise);

        const wrapper = shallow(
            <FetchFold {...defaultProps} getData={getData} />,
        );
        const button = wrapper.find(Button);
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        button.simulate('click');
        expect(getData).toHaveBeenCalledTimes(1);
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
        await dataPromise; // wait for dataPromise to be resolved by component
        wrapper.update();
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        expect(wrapper.find(Folder)).toHaveLength(0);
        expect(wrapper.find(FolderOpen)).toHaveLength(1);
        expect(wrapper.find('.children')).toHaveLength(1);
        expect(defaultProps.children).toHaveBeenCalledWith({
            ...defaultProps,
            getData,
            data: {
                hits: [
                    { name: 1, count: 10 },
                    { name: 2, count: 20 },
                    { name: 3, count: 30 },
                ],
            },
            nbSiblings: 3,
        });
        expect(wrapper.find('p')).toHaveLength(0);
    });

    it('should display an error when getData fail', async () => {
        const dataPromise = Promise.reject(new Error('Boom !'));
        const getData = jest.fn(() => dataPromise);

        const wrapper = shallow(
            <FetchFold {...defaultProps} getData={getData} />,
        );
        const button = wrapper.find(Button);
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        button.simulate('click');
        expect(getData).toHaveBeenCalledTimes(1);
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
        await dataPromise.catch(v => v); // wait for dataPromise to get rejected by component
        wrapper.update();
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        expect(wrapper.find(Folder)).toHaveLength(0);
        expect(wrapper.find(FolderOpen)).toHaveLength(0);
        expect(wrapper.find('li')).toHaveLength(0);
        const alert = wrapper.find(AdminOnlyAlert);
        expect(alert).toHaveLength(1);
        expect(alert.prop('children')).toBe('istex_error');
        expect(defaultProps.children).toHaveBeenCalledTimes(0);
        expect(wrapper.find('p')).toHaveLength(0);
    });

    it('should not render if count is 0', () => {
        const wrapper = shallow(<FetchFold {...defaultProps} count={0} />);
        expect(wrapper.find(Folder)).toHaveLength(0);
        expect(wrapper.find(FolderOpen)).toHaveLength(0);
        expect(wrapper.find(AdminOnlyAlert)).toHaveLength(0);
        expect(wrapper.find('p')).toHaveLength(0);
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
