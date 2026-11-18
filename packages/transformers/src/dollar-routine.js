import transformer from './operations/ROUTINE.js';
import dollar from './dollar.js';

export default function $ROUTINE(data, feed) {
    return dollar(this, data, feed, transformer);
}
