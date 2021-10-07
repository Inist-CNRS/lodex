import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import { ClearDatasetButtonComponent as ClearDatasetButton } from './ClearDatasetButton';
import ClearDialog from '../Appbar/ClearDialog';

describe('<ClearDatasetButton />', () => {
    it('should only display a button when mounted', () => {
        const wrapper = shallow(
            <ClearDatasetButton
                hasLoadedDataset={false}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        expect(wrapper.find(ClearDialog).exists()).toBeFalsy();
    });

    it('should have button disabled if hasLoadedDataset is falsy', () => {
        const wrapper = shallow(
            <ClearDatasetButton
                hasLoadedDataset={false}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).prop('disabled')).toBeTruthy();
    });

    it('should display ClearDialog on button click', () => {
        const wrapper = shallow(
            <ClearDatasetButton
                hasLoadedDataset={false}
                p={{ t: key => key }}
            />,
        );

        wrapper.find(Button).simulate('click');

        expect(wrapper.find(ClearDialog).exists()).toBeTruthy();
    });
});
