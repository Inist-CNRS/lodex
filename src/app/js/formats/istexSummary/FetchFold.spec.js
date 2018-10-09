import React from 'react';
import { shallow } from 'enzyme';
import Folder from 'material-ui/svg-icons/file/folder';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';
import Button from 'material-ui/FlatButton';
import { CircularProgress } from 'material-ui';
import { StyleSheetTestUtils } from 'aphrodite';

import { FetchFold } from './FetchFold';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';

describe('FetchFold', () => {
    const defaultProps = {
        getData: jest.fn(() => Promise.resolve([])),
        children: jest.fn(),
        label: 'label',
        p: { t: v => v },
    };

    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
        defaultProps.children.mockClear();
    });

    it('should render closed', () => {
        const wrapper = shallow(<FetchFold {...defaultProps} />);
        expect(wrapper.find(Folder).length).toBe(1);
        expect(wrapper.find(FolderOpen).length).toBe(0);
        expect(wrapper.find('li').length).toBe(0);
        expect(defaultProps.children).toHaveBeenCalledTimes(0);
        expect(defaultProps.getData).toHaveBeenCalledTimes(0);
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
    });

    it('should open and fetch data when clicking on button', async () => {
        const dataPromise = Promise.resolve([1, 2, 3]);
        const getData = jest.fn(() => dataPromise);

        const wrapper = shallow(
            <FetchFold {...defaultProps} getData={getData} />,
        );
        const button = wrapper.find(Button);
        expect(wrapper.find(CircularProgress).length).toBe(0);
        button.simulate('click');
        expect(getData).toHaveBeenCalledTimes(1);
        expect(wrapper.find(CircularProgress).length).toBe(1);
        await dataPromise; // // wait for dataPromise to be resolveda by component
        wrapper.update();
        expect(wrapper.find(CircularProgress).length).toBe(0);
        expect(wrapper.find(Folder).length).toBe(0);
        expect(wrapper.find(FolderOpen).length).toBe(1);
        expect(wrapper.find('li')).toHaveLength(3);
        expect(defaultProps.children).toHaveBeenCalledTimes(3);
        expect(defaultProps.children).toHaveBeenCalledWith(1);
        expect(defaultProps.children).toHaveBeenCalledWith(2);
        expect(defaultProps.children).toHaveBeenCalledWith(3);
    });

    it('should display an error when getData fail', async () => {
        const dataPromise = Promise.reject(new Error('Boom !'));
        const getData = jest.fn(() => dataPromise);

        const wrapper = shallow(
            <FetchFold {...defaultProps} getData={getData} />,
        );
        const button = wrapper.find(Button);
        expect(wrapper.find(CircularProgress).length).toBe(0);
        button.simulate('click');
        expect(getData).toHaveBeenCalledTimes(1);
        expect(wrapper.find(CircularProgress).length).toBe(1);
        await dataPromise.catch(v => v); // wait for dataPromise to get rejected by component
        wrapper.update();
        expect(wrapper.find(CircularProgress).length).toBe(0);
        expect(wrapper.find(Folder).length).toBe(0);
        expect(wrapper.find(FolderOpen).length).toBe(0);
        expect(wrapper.find('li')).toHaveLength(0);
        const alert = wrapper.find(AdminOnlyAlert);
        expect(alert).toHaveLength(1);
        expect(alert.prop('children')).toBe('istex_error');
        expect(defaultProps.children).toHaveBeenCalledTimes(0);
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
