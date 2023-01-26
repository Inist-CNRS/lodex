import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import { ClearPublishedButtonComponent as ClearPublishedButton } from './ClearPublishedButton';
import ClearDialog from '../Appbar/ClearDialog';

jest.mock('../../admin/api/field', () => ({
    clearModel: jest.fn(),
}));

describe('<ClearPublishedButton />', () => {
    it('should only display a button when mounted', () => {
        const wrapper = shallow(
            <ClearPublishedButton
                hasPublishedDataset={false}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        expect(wrapper.find(ClearDialog).exists()).toBeFalsy();
    });

    it('should have button disabled if hasPublishedDataset is falsy', () => {
        const wrapper = shallow(
            <ClearPublishedButton
                hasPublishedDataset={false}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).prop('disabled')).toBeTruthy();
    });

    it('should display ClearDialog on button click', () => {
        const wrapper = shallow(
            <ClearPublishedButton
                hasPublishedDataset={false}
                p={{ t: key => key }}
            />,
        );

        wrapper.find(Button).simulate('click');

        expect(wrapper.find(ClearDialog).exists()).toBeTruthy();
    });
});
