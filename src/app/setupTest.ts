import { default as Enzyme } from 'enzyme';
import { default as Adapter } from '@cfaester/enzyme-adapter-react-18';

Enzyme.configure({ adapter: new Adapter() });

// @ts-expect-error TS7017
global.API_URL = 'http://api';
// @ts-expect-error TS7017
global.ISTEX_API_URL = 'https://api.istex.fr';
// @ts-expect-error TS7017
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
