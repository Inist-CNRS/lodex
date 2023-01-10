import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import { AddFieldButtonComponent as AddFieldButton } from './AddFieldButton';

jest.mock('react-router', () => ({
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
            filter: 'bar',
        });
    });
});
