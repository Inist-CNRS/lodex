import { shallow } from 'enzyme';
import { Button } from '@mui/material';

import { ExcerptRemoveColumnComponent as ExcerptRemoveColumn } from './ExcerptRemoveColumn';
import type { Field } from '@lodex/frontend-common/fields/types';

describe('<ExcerptRemoveColumn />', () => {
    it('renders a remove button if column is not uri', () => {
        const field = { name: 'foo', label: 'foo' } as Field;

        const wrapper = shallow(
            <ExcerptRemoveColumn
                field={field}
                removeColumn={() => {}}
                // @ts-expect-error TS2322
                p={{ t: (key) => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it('does not render a remove button if column is uri', () => {
        const field = { name: 'uri', label: 'foo' } as Field;

        const wrapper = shallow(
            <ExcerptRemoveColumn
                field={field}
                removeColumn={() => {}}
                // @ts-expect-error TS2322
                p={{ t: (key) => key }}
            />,
        );

        expect(wrapper.find(Button).exists()).toBeFalsy();
    });
});
