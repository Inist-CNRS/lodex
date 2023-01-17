import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import { AddSubresourceFieldButtonComponent as AddSubresourceFieldButton } from './AddSubresourceFieldButton';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => ({
        filter: 'bar',
    }),
}));

describe('<AddSubresourceFieldButton />', () => {
    it('should call addField with subresourceField created from default one on click if subresource is truthy', () => {
        const addField = jest.fn();
        const subresource = { _id: 'ID', path: 'path' };

        const wrapper = shallow(
            <AddSubresourceFieldButton
                addField={addField}
                subresource={subresource}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper.find(Button).simulate('click');

        expect(addField).toHaveBeenCalledWith({
            subresourceId: 'ID',
            transformers: [
                {
                    operation: 'COLUMN',
                    args: [
                        {
                            name: 'column',
                            type: 'column',
                            value: 'path',
                        },
                    ],
                },
                { operation: 'PARSE' },
            ],
            scope: 'bar',
        });
    });

    it('should not call addField on click if subresource is false', () => {
        const addField = jest.fn();
        const subresource = null;

        const wrapper = shallow(
            <AddSubresourceFieldButton
                addField={addField}
                subresource={subresource}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
        wrapper.find(Button).simulate('click');

        expect(addField).not.toHaveBeenCalled();
    });
});
