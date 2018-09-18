import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.API_URL = 'http://api';
process.env.ISTEX_API_URL = 'https://istex';
