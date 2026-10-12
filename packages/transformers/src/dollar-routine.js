import transformer from './operations/ROUTINE';
import dollar from './dollar';

export default function $ROUTINE(data, feed) {
    return dollar(this, data, feed, transformer);
}
