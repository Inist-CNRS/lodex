import React from 'react';
import { shallow } from 'enzyme';
import { Button, Dialog } from '@material-ui/core';
import { PopupConfirmUploadComponent as PopupConfirmUpload } from './PopupConfirmUpload';
import CancelButton from '../../lib/components/CancelButton';

describe('<PopupConfirmUpload />', () => {
    it('should render a popup for confirm upload', () => {
        const wrapper = shallow(
            <PopupConfirmUpload
                p={{ t: key => key }}
                setIsOpenPopupConfirm={() => {}}
                isOpen
                onConfirm={() => {}}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it('should render the onConfirm action on click', () => {
        const onConfirm = jest.fn();
        const wrapper = shallow(
            <PopupConfirmUpload
                p={{ t: key => key }}
                setIsOpenPopupConfirm={() => {}}
                isOpen
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
        const handleClose = jest.fn();
        const wrapper = shallow(
            <PopupConfirmUpload
                p={{ t: key => key }}
                setIsOpenPopupConfirm={handleClose}
                isOpen
                onConfirm={() => {}}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(CancelButton).exists()).toBeTruthy();
        wrapper.find(CancelButton).simulate('click');
        expect(handleClose).toHaveBeenCalled();
    });
});
