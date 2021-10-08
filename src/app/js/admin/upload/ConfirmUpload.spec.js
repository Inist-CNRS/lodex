import React from 'react';
import { shallow } from 'enzyme';
import { Button, Dialog } from '@material-ui/core';
import { ConfirmUploadComponent as ConfirmUpload } from './ConfirmUpload';

describe('<ConfirmUpload />', () => {
    it('should render a popup for confirm upload', () => {
        const wrapper = shallow(
            <ConfirmUpload
                p={{ t: key => key }}
                cancelUpload={() => {}}
                isOpenPopup
                onConfirm={() => {}}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it('should render the onConfirm action on click', () => {
        const onConfirm = jest.fn();
        const wrapper = shallow(
            <ConfirmUpload
                p={{ t: key => key }}
                cancelUpload={() => {}}
                isOpenPopup
                onConfirm={onConfirm}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper
            .find(Button)
            .first()
            .simulate('click');
        expect(onConfirm).toHaveBeenCalled();
    });

    it('should render the cancelUpload action on click', () => {
        const cancelUpload = jest.fn();
        const wrapper = shallow(
            <ConfirmUpload
                p={{ t: key => key }}
                cancelUpload={cancelUpload}
                isOpenPopup
                onConfirm={() => {}}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper
            .find(Button)
            .at(1)
            .simulate('click');
        expect(cancelUpload).toHaveBeenCalled();
    });
});
