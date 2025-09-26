// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';
import { RedirectView, RedirectViewLoader } from './RedirectView';

describe('<RedirectView />', () => {
    it('should render nothing if there is no field', () => {
        const className = 'redirect';
        // @ts-expect-error TS7006
        const p = { t: (x) => x };
        const resource = { covfefe: 'http://example.com' };
        const field = {};

        const wrapper = shallow(
            // @ts-expect-error TS2769
            <RedirectView
                className={className}
                // @ts-expect-error TS2322
                p={p}
                resource={resource}
                field={field}
            />,
        );

        expect(Object.keys(wrapper)).toHaveLength(0);
    });

    it('should render nothing if there is no resource', () => {
        const className = 'redirect';
        // @ts-expect-error TS7006
        const p = { t: (x) => x };
        const resource = {};
        const field = { name: 'covfefe' };

        const wrapper = shallow(
            // @ts-expect-error TS2769
            <RedirectView
                className={className}
                // @ts-expect-error TS2322
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
        // @ts-expect-error TS7006
        const p = { t: (x) => x };
        const resource = { foo: 'http://example.com' };
        const field = { name: 'foo' };

        const wrapper = shallow(
            // @ts-expect-error TS2769
            <RedirectView
                className={className}
                classes={classes}
                // @ts-expect-error TS2322
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
                // @ts-expect-error TS2769
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
                // @ts-expect-error TS2769
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
