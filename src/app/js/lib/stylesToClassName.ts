// @ts-expect-error TS7016
import { StyleSheet, css } from 'aphrodite/no-important';

// @ts-expect-error TS7006
export default (styles, componentName) => {
    const prefix = componentName ? `${componentName}-` : '';
    const stylesheet = StyleSheet.create(styles);
    return Object.keys(stylesheet).reduce(
        (acc, classname) =>
            Object.defineProperty(acc, classname, {
                get: () =>
                    `${css(stylesheet[classname])} ${prefix}${classname}`,
            }),
        {},
    );
};
