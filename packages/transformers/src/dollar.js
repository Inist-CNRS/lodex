import _ from 'lodash';

export default async function dollar(statement, data, feed, transformer, useAllfields) {
    if (statement.isLast()) {
        return feed.close();
    }
    const fields = statement.getParam('field');
    const field = Array.isArray(fields) ? fields.shift() : fields;
    if (!statement.values) {
        const { args } = transformer.getMetas();
        let index = -1;
        statement.values = args.map((arg) => {
            const vals = statement.getParam(arg.name);
            if (Array.isArray(vals)) {
                index += 1;
                return {
                    ...arg,
                    value: vals[index],
                };
            }
            return {
                ...arg,
                value: vals,
            };
        });
    }

    const source = data.$origin || data;
    const input = (useAllfields && source) || _.get(source, field) || _.get(data, field, null);
    const output = await transformer(input, statement.values)(input);

    if (!data.$origin) {
        const target = {};
        _.set(target, '$origin', source);
        _.unset(target.$origin, field);
        _.set(target, field, output);
        return feed.send(target);
    }
    _.unset(data.$origin, field);
    _.set(data, field, output);
    return feed.send(data);
}
