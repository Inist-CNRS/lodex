import React from 'react';
import { shallow } from 'enzyme';
import Folder from 'material-ui/svg-icons/file/folder';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';
import Button from 'material-ui/FlatButton';
import { CircularProgress } from 'material-ui';
import { StyleSheetTestUtils } from 'aphrodite';

import { FetchFold } from './FetchFold';
import Alert from '../../lib/components/Alert';

describe('FetchFold', () => {
    const defaultProps = {
        getData: jest.fn(() => Promise.resolve([])),
        renderData: jest.fn(),
        label: 'label',
        p: { t: v => v },
    };

    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
        defaultProps.renderData.mockClear();
    });

    it('should render closed', () => {
        const wrapper = shallow(<FetchFold {...defaultProps} />);
        expect(wrapper.find(Folder).length).toBe(1);
        expect(wrapper.find(FolderOpen).length).toBe(0);
        expect(wrapper.find('li').length).toBe(0);
        expect(defaultProps.renderData).toHaveBeenCalledTimes(0);
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
        expect(defaultProps.renderData).toHaveBeenCalledTimes(3);
        expect(defaultProps.renderData).toHaveBeenCalledWith(1);
        expect(defaultProps.renderData).toHaveBeenCalledWith(2);
        expect(defaultProps.renderData).toHaveBeenCalledWith(3);
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
        const alert = wrapper.find(Alert);
        expect(alert).toHaveLength(1);
        expect(alert.prop('children')).toBe('istex_error');
        expect(defaultProps.renderData).toHaveBeenCalledTimes(0);
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
