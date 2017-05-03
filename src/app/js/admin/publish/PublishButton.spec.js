import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';

import { PublishButtonComponent as PublishButton } from './PublishButton';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

describe('<Publish />', () => {
    it('should render a publish button', () => {
        const wrapper = shallow(<PublishButton
            p={{ t: key => key }}
            loadField={() => {}}
            isPublishing
            error
            published
        />);

        const button = wrapper.find(ButtonWithStatus).at(0);
        expect(button.prop('label')).toEqual('publish');
        expect(button.prop('loading')).toEqual(true);
        expect(button.prop('error')).toEqual(true);
        expect(button.prop('success')).toEqual(true);
    });

    it('should trigger the onPublish action on click', () => {
        const onPublish = createSpy();

        const wrapper = shallow(<PublishButton
            p={{ t: key => key }}
            loadField={() => {}}
            isPublishing={false}
            onPublish={onPublish}
        />);

        wrapper.find(ButtonWithStatus).simulate('click');
        expect(onPublish).toHaveBeenCalled();
    });
});
