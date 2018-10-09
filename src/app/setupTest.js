import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.API_URL = 'http://api';
global.ISTEX_API_URL = 'https://api.istex.fr';
