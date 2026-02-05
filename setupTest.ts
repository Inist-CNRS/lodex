import { default as Enzyme } from 'enzyme';
import { default as Adapter } from '@cfaester/enzyme-adapter-react-18';

Enzyme.configure({ adapter: new Adapter() });

// @ts-expect-error TS7017
global.API_URL = 'http://api';
// @ts-expect-error TS7017
global.ISTEX_API_URL = 'https://api.istex.fr';
// @ts-expect-error TS7017
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock canvas methods used by vega during tests
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => []),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
})) as any;

// cf. https://www.tutorialpedia.org/blog/referenceerror-structuredclone-is-not-defined-using-jest-with-nodejs-typescript/
if (!globalThis.structuredClone) {
    globalThis.structuredClone = (obj: any) => {
        if (obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        return obj;
    };
}
