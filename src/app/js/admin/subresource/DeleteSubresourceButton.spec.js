import React from 'react';
import { shallow } from 'enzyme';
import { Button, Dialog } from '@material-ui/core';

import { DeleteSubresourceButtonComponent as DeleteSubresourceButton } from './DeleteSubresourceButton';

describe('<DeleteSubresourceButton />', () => {
    it('should call setShowDeletePopup with true on button click', () => {
        const onClick = jest.fn();
        const setShowDeletePopup = jest.fn();
        const showDeletePopup = false;

        const wrapper = shallow(
            <DeleteSubresourceButton
                onClick={onClick}
                setShowDeletePopup={setShowDeletePopup}
                showDeletePopup={showDeletePopup}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper.find(Button).simulate('click');

        expect(setShowDeletePopup).toHaveBeenCalledWith(true);
    });

    it('should show Dialog if showDeletePopup is truthy', () => {
        const onClick = jest.fn();
        const setShowDeletePopup = jest.fn();
        const showDeletePopup = true;

        const wrapper = shallow(
            <DeleteSubresourceButton
                onClick={onClick}
                setShowDeletePopup={setShowDeletePopup}
                showDeletePopup={showDeletePopup}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Dialog).exists()).toBeTruthy();
    });

    it('should call onClick on Dialog button click', () => {
        const onClick = jest.fn();
        const setShowDeletePopup = jest.fn();
        const showDeletePopup = true;

        const wrapper = shallow(
            <DeleteSubresourceButton
                onClick={onClick}
                setShowDeletePopup={setShowDeletePopup}
                showDeletePopup={showDeletePopup}
                p={{ t: key => key }}
            />,
        );

        const okButton = wrapper.findWhere(node => {
            return node.type() === Button && node.text() === 'OK';
        });

        expect(okButton.exists()).toBeTruthy();
        okButton.simulate('click');

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
