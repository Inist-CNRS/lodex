import { createElement } from 'react';

// @ts-expect-error TS7006
export const concat = (render1, render2) => {
    // @ts-expect-error TS7006
    const Component = (props) =>
        // @ts-expect-error TS7006
        createElement(render2, props, (p) =>
            createElement(render1, { ...props, ...p }),
        );
    return Component;
};

// @ts-expect-error TS7031
export const neutral = ({ children }) => children();

// @ts-expect-error TS7006
export default function composeRenderProps(renderProps) {
    return renderProps.reverse().reduce(concat, neutral);
}
