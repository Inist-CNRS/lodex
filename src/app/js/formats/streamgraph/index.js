import Component from './Streamgraph';
import DefaultFormat from '../DefaultFormat';
import Icon from './StreamgraphIcon';

export default {
    ...DefaultFormat,
    Component,
    Icon,
    predicate: (value, formatData) => {
        if (!DefaultFormat.predicate(value)) {
            return false;
        }

        if (formatData === 'loading' || typeof formatData === 'undefined') {
            return true;
        }

        return Array.isArray(formatData) && formatData.length;
    },
};
