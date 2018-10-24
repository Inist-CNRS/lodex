import React from 'react';
import { shallow } from 'enzyme';

import MarkdownView from './MarkdownView';
import InvalidFormat from '../InvalidFormat';

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

    it('should render an InvalidFormat for an invalid value', () => {
        const resource = { foo: [1, 2, 3] };
        const field = { name: 'foo' };
        const wrapper = shallow(
            <MarkdownView resource={resource} field={field} />,
        );
        expect(wrapper.find(InvalidFormat).length).toEqual(1);
    });
});
