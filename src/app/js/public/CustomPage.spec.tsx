// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';
import { CircularProgress } from '@mui/material';

import { CustomPage } from './CustomPage';
import fetch from '../lib/fetch';
jest.mock('../lib/fetch');

describe('getCustomPage CustomPage', () => {
    const defaultProps = {
        // @ts-expect-error TS7006
        p: { t: (v) => v },
        location: {
            pathname: '/custom/page',
        },
        link: '/custom/page',
    };

    beforeEach(() => {
        // @ts-expect-error TS2339
        fetch.mockClear();
    });

    it('should render spinner at first', () => {
        // @ts-expect-error TS2339
        fetch.mockImplementation(() => Promise.resolve({ response: {} }));
        const wrapper = shallow(<CustomPage {...defaultProps} />);
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
    });

    it('should fetch link data and render html and scripts tag', async () => {
        const response = Promise.resolve({
            response: {
                html: '<div>Custom page content</div>',
                scripts: ['/script.js', '/other/script.js'],
            },
        });
        // @ts-expect-error TS2339
        fetch.mockImplementation(() => response);
        const wrapper = shallow(<CustomPage {...defaultProps} />);
        expect(fetch).toHaveBeenCalledWith({
            url: '/customPage/?page=custom%2Fpage',
        });
        await response;
        wrapper.update();
        const div = wrapper.find('div');
        expect(div.prop('dangerouslySetInnerHTML')).toEqual({
            __html: '<div>Custom page content</div>',
        });
        const scripts = wrapper.find('script');
        expect(scripts).toHaveLength(2);
        const expectedScripts = ['/script.js', '/other/script.js'];
        scripts.forEach((script, index) =>
            expect(script.prop('src')).toEqual(expectedScripts[index]),
        );
    });

    it('should render nothing if could not fetch page data', async () => {
        const wait = () => new Promise((resolve) => setTimeout(resolve)); //Will wait for component to re-render after the setState of the error
        const response = Promise.resolve({ error: new Error('nope') });
        // @ts-expect-error TS2339
        fetch.mockImplementation(() => response);
        const wrapper = shallow(<CustomPage {...defaultProps} />);
        expect(fetch).toHaveBeenCalledWith({
            url: '/customPage/?page=custom%2Fpage',
        });
        await response;

        wrapper.update();
        return wait().then(() => {
            expect(wrapper.find('div')).toHaveLength(0);
            expect(wrapper.find(CircularProgress)).toHaveLength(0);
            const scripts = wrapper.find('script');
            expect(scripts).toHaveLength(0);
        });
    });
});
