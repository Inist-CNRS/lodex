import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import { AddFieldButtonComponent as AddFieldButton } from './AddFieldButton';
import { SCOPE_DATASET } from '../../../../common/scope';

describe('<AddFieldButton />', () => {
    it('should call onAddNewField with name prop as arg on click', () => {
        const onAddNewField = jest.fn();

        const wrapper = shallow(
            <AddFieldButton
                onAddNewField={onAddNewField}
                name="foo"
                scope={SCOPE_DATASET}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper.find(Button).simulate('click');

        expect(onAddNewField).toHaveBeenCalledWith({
            name: 'foo',
            scope: SCOPE_DATASET,
        });
    });
});
