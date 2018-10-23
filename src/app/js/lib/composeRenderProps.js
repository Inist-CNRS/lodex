import { createElement } from 'react';

export const concat = (render1, render2) => props =>
    createElement(render2, props, p =>
        createElement(render1, { ...props, ...p }),
    );

export const neutral = ({ children }) => children();

export default renderProps => renderProps.reverse().reduce(concat, neutral);
