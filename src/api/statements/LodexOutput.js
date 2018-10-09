import get from 'lodash.get';
import unset from 'lodash.unset';

export default function LodexOutput(data, feed) {
    const keyName = this.getParam('keyName', 'data');
    const indent = this.getParam('indent', false);
    const extract = this.getParam('extract');
    const extracts = Array.isArray(extract) ? extract : [extract];
    const keys = extracts.filter(x => x);

    const json = d => JSON.stringify(d, null, indent ? '    ' : null);

    if (this.isFirst() && !this.isLast()) {
        const values = keys.map(p => get(data, p));
        feed.write('{');
        if (keys.length > 0) {
            keys.forEach((k, index) => {
                feed.write(index === 0 ? '' : ',');
                feed.write(json(k));
                feed.write(':');
                feed.write(json(values[index]));
            });
            feed.write(`,"${keyName}":[`);
        } else {
            feed.write(`"${keyName}":[`);
        }
    } else if (!this.isLast()) {
        feed.write(',\n');
    }
    if (!this.isLast()) {
        keys.forEach(p => unset(data, p));
        feed.write(json(data));
    } else if (this.isLast() && this.getIndex() > 0) {
        feed.write(']}');
        feed.close();
    } else {
        feed.write('{"total": 0}');
        feed.close();
    }
    feed.end();
}
