import React from 'react';
import { shallow } from 'enzyme';
import fetch from 'fetch-with-proxy';

import { CustomPage } from './getCustomPage';
jest.mock('fetch-with-proxy');

describe('getCustomPage CustomPage', () => {
    const defaultProps = {
        p: { t: v => v },
        link: '/custom/page',
    };

    beforeEach(() => {
        fetch.mockClear();
    });

    it('should render nothing at first', () => {
        fetch.mockImplementation(() => Promise.resolve({ json: () => {} }));
        const wrapper = shallow(<CustomPage {...defaultProps} />);
        const div = wrapper.find('div');
        expect(div).toHaveLength(0);
    });

    it('should fetch link data and render html and scripts tag', async () => {
        const response = Promise.resolve({
            json: () => ({
                html: '<div>Custom page content</div>',
                scripts: ['/script.js', '/other/script.js'],
            }),
        });
        fetch.mockImplementation(() => response);
        const wrapper = shallow(<CustomPage {...defaultProps} />);
        expect(fetch).toHaveBeenCalledWith('/customPage/custom/page');
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

    it('should render not found if could not fetch page data', async () => {
        const response = Promise.reject(new Error('nope'));
        fetch.mockImplementation(() => response);
        const wrapper = shallow(<CustomPage {...defaultProps} />);
        expect(fetch).toHaveBeenCalledWith('/customPage/custom/page');
        await response.catch(() => null);
        wrapper.update();
        const div = wrapper.find('div');
        expect(div.text()).toEqual('page_not_found');
        const scripts = wrapper.find('script');
        expect(scripts).toHaveLength(0);
    });
});
