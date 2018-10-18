import { cloneElement } from 'react';

export default (parent, renderProps) => {
    const composedRender = renderProps.reverse().reduce((acc, render) => {
        if (!acc) {
            return render;
        }
        return (...args) => cloneElement(render(...args), { children: acc });
    }, null);

    return cloneElement(parent, {}, composedRender);
};
