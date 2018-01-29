import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import TitleView from './TitleView';

describe('<TitleView />', () => {
    it('should render', () => {
        const resource = { foo: 'Run you fools!' };
        const field = { name: 'foo' };
        const wrapper = shallow(
            <TitleView resource={resource} field={field} level={1} />,
        );
        expect(wrapper.find('h1').text()).toEqual('Run you fools!');
    });
});
