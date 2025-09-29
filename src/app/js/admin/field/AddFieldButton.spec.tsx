// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@mui/material';

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
            // @ts-expect-error TS7006
            <AddFieldButton
                onAddNewField={onAddNewField}
                // @ts-expect-error TS2322
                name="foo"
                // @ts-expect-error TS7006
                p={{ t: (key) => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper.find(Button).simulate('click');

        expect(onAddNewField).toHaveBeenCalledWith({
            scope: 'bar',
        });
    });
});
