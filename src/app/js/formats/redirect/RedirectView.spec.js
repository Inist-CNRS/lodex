import React from 'react';
import { shallow } from 'enzyme';

import RedirectView from './RedirectView';

describe('<RedirectView />', () => {
    it('should render', () => {
        const resource = { foo: 'Run you fools!' };
        const field = { name: 'foo' };
        const wrapper = shallow(
            <RedirectView resource={resource} field={field} />,
        );
        expect(wrapper.find('span').text()).toEqual('Run you fools!');
    });
});
