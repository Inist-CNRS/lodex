import React from 'react';
import { shallow } from 'enzyme';
import { RedirectView, RedirectViewLoader } from './RedirectView';

describe('<RedirectView />', () => {
    it('should render nothing if there is no field', () => {
        const className = 'redirect';
        const p = { t: x => x };
        const resource = { covfefe: 'http://example.com' };
        const field = {};

        const wrapper = shallow(
            <RedirectView
                className={className}
                p={p}
                resource={resource}
                field={field}
            />,
        );

        expect(Object.keys(wrapper)).toHaveLength(0);
    });

    it('should render nothing if there is no resource', () => {
        const className = 'redirect';
        const p = { t: x => x };
        const resource = {};
        const field = { name: 'covfefe' };

        const wrapper = shallow(
            <RedirectView
                className={className}
                p={p}
                resource={resource}
                field={field}
            />,
        );

        expect(Object.keys(wrapper)).toHaveLength(0);
    });

    it('should render a <RedirectViewLoader />', () => {
        const className = 'redirect';
        const classes = {};
        const p = { t: x => x };
        const resource = { foo: 'http://example.com' };
        const field = { name: 'foo' };

        const wrapper = shallow(
            <RedirectView
                className={className}
                classes={classes}
                p={p}
                resource={resource}
                field={field}
            />,
        );

        expect(wrapper.find(RedirectViewLoader)).toHaveLength(1);
    });

    describe('<RedirectViewLoader/>', () => {
        it('should render a title', () => {
            const classes = {};
            const title = 'Fake Zelda';
            const url = 'http://myfakelink.com';

            const wrapper = shallow(
                <RedirectViewLoader
                    classes={classes}
                    title={title}
                    url={url}
                />,
            );

            expect(wrapper.find('h1').text()).toBe('Fake Zelda');
        });

        it('should render an url', () => {
            const classes = {};
            const title = 'Fake Zelda';
            const url = 'http://myfakelink.com';

            const wrapper = shallow(
                <RedirectViewLoader
                    classes={classes}
                    title={title}
                    url={url}
                />,
            );

            expect(wrapper.find('a').text()).toBe('http://myfakelink.com');
        });
    });
});
