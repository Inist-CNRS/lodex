import React from 'react';
import { shallow } from 'enzyme';

import Alert from './Alert';

describe('<Alert />', () => {
    it('should render its children', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <Alert>
                <p>foo</p>
            </Alert>,
        );
        // @ts-expect-error TS2345
        expect(wrapper.contains(<p>foo</p>)).toBe(true);
    });
});
