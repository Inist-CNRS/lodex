import React from 'react';
import { shallow } from 'enzyme';

import {
    canPublish,
    PublishButtonComponent as PublishButton,
} from './PublishButton';
import { Button } from '@mui/material';

describe('<Publish />', () => {
    it('should render a publish button', () => {
        const wrapper = shallow(<PublishButton p={{ t: key => key }} />);

        const button = wrapper.find(Button).at(0);
        expect(button.prop('children')).toEqual('publish');
    });

    it('should trigger the onPublish action on click', () => {
        const onPublish = jest.fn();

        const wrapper = shallow(
            <PublishButton
                p={{ t: key => key }}
                loadField={() => {}}
                isPublishing={false}
                onPublish={onPublish}
            />,
        );

        wrapper.find(Button).simulate('click');
        expect(onPublish).toHaveBeenCalled();
    });

    it('should return true if there are other fields than uri for publication', () => {
        const state = {
            allValid: true,
            list: [{ name: 'uri' }, { name: 'label' }, { name: 'test' }],
        };
        const isCanPublish = canPublish(state.allValid, state.list);
        expect(isCanPublish).toBeTruthy();
    });

    it('should return false if there are no other fields except uri for publication', () => {
        const state = {
            allValid: true,
            list: [{ name: 'uri' }],
        };
        const isCanPublish = canPublish(state.allValid, state.list);
        expect(isCanPublish).not.toBeTruthy();
    });
});
