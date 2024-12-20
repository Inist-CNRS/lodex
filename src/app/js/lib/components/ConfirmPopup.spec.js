import React from 'react';
import { shallow } from 'enzyme';
import { Button, Dialog } from '@mui/material';
import { ConfirmPopup } from './ConfirmPopup';
import CancelButton from './CancelButton';

describe('<PopupConfirmUpload />', () => {
    it('should render a popup for confirm upload', () => {
        const wrapper = shallow(
            <ConfirmPopup
                cancelLabel="Cancel"
                confirmLabel="Confirm"
                description="Description"
                onCancel={jest.fn()}
                title="title"
                isOpen
                onConfirm={jest.fn()}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it('should call the onConfirm props when clicking on the confirm button', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        const wrapper = shallow(
            <ConfirmPopup
                cancelLabel="Cancel"
                confirmLabel="Confirm"
                description="Description"
                onCancel={onCancel}
                title="title"
                isOpen
                onConfirm={onConfirm}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper.find(Button).first().simulate('click');
        expect(onConfirm).toHaveBeenCalled();
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('should call the onCancel props when clicking on cancel button', () => {
        const onCancel = jest.fn();
        const onConfirm = jest.fn();
        const wrapper = shallow(
            <ConfirmPopup
                isOpen
                cancelLabel="Cancel"
                confirmLabel="Confirm"
                description="Description"
                onCancel={onCancel}
                title="title"
                onConfirm={onConfirm}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(CancelButton).exists()).toBeTruthy();
        wrapper.find(CancelButton).simulate('click');
        expect(onCancel).toHaveBeenCalled();
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
