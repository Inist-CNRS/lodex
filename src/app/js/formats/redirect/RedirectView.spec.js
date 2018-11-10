import React from 'react';
import { shallow } from 'enzyme';
import InvalidFormat from '../InvalidFormat';
import RedirectView from './RedirectView';

describe('<RedirectView />', () => {
    it('should render if url', () => {
        const resource = { foo: 'http://example.com' };
        const field = { name: 'foo' };
        const wrapper = shallow(
            <RedirectView resource={resource} field={field} />,
        );
        expect(wrapper.find('a').text()).toEqual('http://example.com');
    });
    it('should render an InvalidFormat for an invalid value', () => {
        const resource = { foo: 'Run you fools!' };
        const field = { name: 'foo' };
        const wrapper = shallow(
            <RedirectView resource={resource} field={field} />,
        );
        expect(wrapper.find(InvalidFormat).length).toEqual(1);
    });
});
