import setWith from 'lodash.setwith';
import clone from 'lodash.clone';

// set that do not mutate value, and clone only changed path
export default (data, path, value) => setWith(clone(data), path, value, clone);
