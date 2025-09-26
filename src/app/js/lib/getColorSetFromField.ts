import get from 'lodash/get';
import memoize from 'lodash/memoize';

export default memoize(
    (field) => {
        const colors = get(field, 'format.args.colors', '');
        return (
            colors
                .split(/[^\w]/)
                // @ts-expect-error TS7006
                .filter((x) => x.length > 0)
                // @ts-expect-error TS7006
                .map((x) => `#${x}`)
        );
    },
    (field) => get(field, 'format.args.colors', ''),
);
