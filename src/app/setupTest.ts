import { default as Enzyme } from 'enzyme';
import { default as Adapter } from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

// @ts-expect-error TS7017
global.API_URL = 'http://api';
// @ts-expect-error TS7017
global.ISTEX_API_URL = 'https://api.istex.fr';
