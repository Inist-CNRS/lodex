import React from 'react';
import { shallow } from 'enzyme';
import FlatButton from 'material-ui/FlatButton';

import { ExcerptRemoveColumnComponent as ExcerptRemoveColumn } from './ExcerptRemoveColumn';

describe('<ExcerptRemoveColumn />', () => {
    it('renders a remove button if column is not uri', () => {
        const field = { name: 'foo', label: 'foo' };

        const wrapper = shallow(
            <ExcerptRemoveColumn
                field={field}
                removeColumn={() => {}}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(FlatButton).exists()).toBeTruthy();
    });

    it('does not render a remove button if column is uri', () => {
        const field = { name: 'uri', label: 'foo' };

        const wrapper = shallow(
            <ExcerptRemoveColumn
                field={field}
                removeColumn={() => {}}
                p={{ t: key => key }}
            />,
        );

        expect(wrapper.find(FlatButton).exists()).toBeFalsy();
    });
});
