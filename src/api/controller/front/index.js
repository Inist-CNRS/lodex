import dev from './dev';
import prod from './prod';

export default process.env.NODE_ENV === 'development' ? dev : prod();
