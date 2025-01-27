import { default as Enzyme } from 'enzyme';
import { default as Adapter } from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

global.API_URL = 'http://api';
global.ISTEX_API_URL = 'https://api.istex.fr';
