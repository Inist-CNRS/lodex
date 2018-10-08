import React from 'react';
import { shallow } from 'enzyme';

import MarkdownView from './MarkdownView';

describe('<MarkdownView />', () => {
    it('should render', () => {
        const resource = { foo: '__Run you fools!__' };
        const field = { name: 'foo' };
        const wrapper = shallow(
            <MarkdownView resource={resource} field={field} />,
        );
        expect(wrapper.find('div').length).toEqual(1);
        expect(wrapper.prop('dangerouslySetInnerHTML')).toEqual({
            __html: '<p><strong>Run you fools!</strong></p>\n',
        });
    });
});
