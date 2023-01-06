import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import { AddFieldButtonComponent as AddFieldButton } from './AddFieldButton';

const mockedHistory = {
    push: jest.fn(),
};

jest.mock('react-router', () => ({
    useHistory: jest.fn(() => mockedHistory),
    useParams: () => ({
        filter: 'bar',
    }),
}));

describe('<AddFieldButton />', () => {
    it('should call onAddNewField with name prop as arg on click', () => {
        const onAddNewField = jest.fn();

        const wrapper = shallow(
            <AddFieldButton
                onAddNewField={onAddNewField}
                name="foo"
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper.find(Button).simulate('click');

        expect(onAddNewField).toHaveBeenCalledWith({
            name: 'foo',
        });
        expect(mockedHistory.push).toHaveBeenCalledWith('/display/bar/edit');
    });
});
