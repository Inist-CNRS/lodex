// @ts-expect-error TS7016
import get from 'lodash/get';
// @ts-expect-error TS7016
import memoize from 'lodash/memoize';

export default memoize(
    // @ts-expect-error TS7006
    (field) => {
        const colors = get(field, 'format.args.colors', '');
        return colors
            .split(/[^\w]/)
            // @ts-expect-error TS7006
            .filter((x) => x.length > 0)
            // @ts-expect-error TS7006
            .map((x) => `#${x}`);
    },
    // @ts-expect-error TS7006
    (field) => get(field, 'format.args.colors', ''),
);
