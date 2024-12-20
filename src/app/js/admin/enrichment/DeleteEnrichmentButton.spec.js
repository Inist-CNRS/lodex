import React from 'react';
import { shallow } from 'enzyme';
import { DeleteEnrichmentButton } from './DeleteEnrichmentButton';
import { Button } from '@mui/material';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import CancelButton from '../../lib/components/CancelButton';
import { deleteEnrichment } from '../api/enrichment';

jest.mock('../api/enrichment', () => ({
    deleteEnrichment: jest.fn(() => ({ response: jest.fn() })),
}));

describe('DeleteEnrichmentButton', () => {
    it('should render a Delete button with closed dialog', () => {
        const wrapper = shallow(
            <DeleteEnrichmentButton
                polyglot={{ t: (v) => v }}
                disabled={false}
                history={{ push: jest.fn() }}
                id="id"
                onDeleteStart={jest.fn()}
                onDeleteEnd={jest.fn()}
            />,
        );

        const DeleteButton = wrapper.find(Button);
        expect(DeleteButton).toHaveLength(1);

        const ConfirmDialog = wrapper.find(ConfirmPopup);
        expect(ConfirmDialog).toHaveLength(1);
        expect(ConfirmDialog.props().isOpen).toBe(false);
    });
    it('should open dialog when clicking on delete button', () => {
        const wrapper = shallow(
            <DeleteEnrichmentButton
                polyglot={{ t: (v) => v }}
                disabled={false}
                history={{ push: jest.fn() }}
                id="id"
                onDeleteStart={jest.fn()}
                onDeleteEnd={jest.fn()}
            />,
        );

        const DeleteButton = wrapper.find(Button);
        expect(DeleteButton).toHaveLength(1);
        DeleteButton.at(0).simulate('click');

        const ConfirmDialog = wrapper.find(ConfirmPopup);
        expect(ConfirmDialog).toHaveLength(1);
        expect(ConfirmDialog.props().isOpen).toBe(true);
    });

    it('should close modal without doing anything when clicking on cancel', () => {
        const onDeleteStart = jest.fn();
        const onDeleteEnd = jest.fn();
        const historyPush = jest.fn();

        const wrapper = shallow(
            <DeleteEnrichmentButton
                polyglot={{ t: (v) => v }}
                disabled={false}
                history={{ push: historyPush }}
                id="id"
                onDeleteStart={onDeleteStart}
                onDeleteEnd={onDeleteEnd}
            />,
        );

        const DeleteButton = wrapper.find(Button);
        expect(DeleteButton).toHaveLength(1);
        DeleteButton.at(0).simulate('click');

        const ConfirmDialog = wrapper.find(ConfirmPopup);
        expect(ConfirmDialog).toHaveLength(1);
        expect(ConfirmDialog.props().isOpen).toBe(true);

        const cancelButton = ConfirmDialog.shallow().find(CancelButton);
        expect(cancelButton).toHaveLength(1);
        cancelButton.at(0).simulate('click');
        expect(wrapper.find(ConfirmPopup).props().isOpen).toBe(false);

        expect(onDeleteStart).toHaveBeenCalledTimes(0);
        expect(onDeleteEnd).toHaveBeenCalledTimes(0);
        expect(historyPush).toHaveBeenCalledTimes(0);
        expect(deleteEnrichment).toHaveBeenCalledTimes(0);
    });

    it('should close modal and delete enrichment when clicking confirm button', () => {
        const onDeleteStart = jest.fn();
        const onDeleteEnd = jest.fn();
        const historyPush = jest.fn();

        const wrapper = shallow(
            <DeleteEnrichmentButton
                polyglot={{ t: (v) => v }}
                disabled={false}
                history={{ push: historyPush }}
                id="id"
                onDeleteStart={onDeleteStart}
                onDeleteEnd={onDeleteEnd}
            />,
        );

        const DeleteButton = wrapper.find(Button);
        expect(DeleteButton).toHaveLength(1);
        DeleteButton.at(0).simulate('click');

        const ConfirmDialog = wrapper.find(ConfirmPopup);
        expect(ConfirmDialog).toHaveLength(1);
        expect(ConfirmDialog.props().isOpen).toBe(true);

        const confirmButton = ConfirmDialog.shallow().find(Button);
        expect(confirmButton).toHaveLength(1);
        confirmButton.at(0).simulate('click');
        expect(wrapper.find(ConfirmPopup).props().isOpen).toBe(false);

        expect(onDeleteStart).toHaveBeenCalledTimes(1);
        expect(deleteEnrichment).toHaveBeenCalledTimes(1);
    });
});
