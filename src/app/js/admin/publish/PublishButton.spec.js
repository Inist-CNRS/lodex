import React from 'react';
import { shallow } from 'enzyme';

import {
    canPublish,
    PublishButtonComponent as PublishButton,
} from './PublishButton';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

describe('<Publish />', () => {
    it('should render a publish button', () => {
        const wrapper = shallow(
            <PublishButton
                p={{ t: key => key }}
                loadField={() => {}}
                isPublishing
                error
                published
            />,
        );

        const button = wrapper.find(ButtonWithStatus).at(0);
        expect(button.prop('children')).toEqual('publishing');
        expect(button.prop('loading')).toEqual(true);
        expect(button.prop('error')).toEqual(true);
        expect(button.prop('success')).toEqual(true);
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

        wrapper.find(ButtonWithStatus).simulate('click');
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
