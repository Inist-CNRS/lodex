import React from 'react';
// @ts-expect-error TS7016
import { shallow } from 'enzyme';

import HtmlView from './HtmlView';

describe('<HtmlView />', () => {
    it('should render', () => {
        const resource = { foo: '<b>Run you fools!</b>' };
        const field = { name: 'foo' };
        const wrapper = shallow(<HtmlView resource={resource} field={field} />);
        expect(wrapper.find('div')).toHaveLength(1);
        expect(wrapper.prop('dangerouslySetInnerHTML')).toEqual({
            __html: '<b>Run you fools!</b>',
        });
    });
});
