import { host } from 'config';
import driver from '../../common/tests/chromeDriver';

export default path => driver.get(`${host}${path}`);
