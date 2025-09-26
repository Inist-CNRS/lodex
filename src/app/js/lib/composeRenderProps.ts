import { createElement } from 'react';

export const concat = (render1, render2) => {
    const Component = (props) =>
        createElement(render2, props, (p) =>
            createElement(render1, { ...props, ...p }),
        );
    return Component;
};

export const neutral = ({ children }) => children();

export default function composeRenderProps(renderProps) {
    return renderProps.reverse().reduce(concat, neutral);
}
