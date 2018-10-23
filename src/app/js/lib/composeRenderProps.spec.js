import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import composeRenderProps from './composeRenderProps';

describe('composeRenderProps', () => {
    it('should compose renderProps', () => {
        const Div = ({ children }) => <div>{children()}</div>;
        Div.propTypes = {
            children: PropTypes.func,
        };

        const P = ({ children }) => <p>{children()}</p>;
        P.propTypes = {
            children: PropTypes.func,
        };

        const Span = () => <span>nested</span>;
        const renderP = () => <P />;
        const renderSpan = () => <Span />;
        const composedComponent = composeRenderProps(<Div />, [
            renderP,
            renderSpan,
        ]);
        const wrapper = mount(composedComponent);
        expect(wrapper.html()).toBe('<div><p><span>nested</span></p></div>');
    });
});
