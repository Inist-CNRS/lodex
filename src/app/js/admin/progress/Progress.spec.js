import React from 'react';
import { shallow } from 'enzyme';
import { Dialog, LinearProgress } from '@material-ui/core';

import { ProgressComponent as Progress } from './Progress';
import { PENDING, STARTING } from '../../../../common/progressStatus';

const identity = x => x;

describe('Progress', () => {
    const defaultProps = {
        loadProgress: () => null,
        clearProgress: () => null,
        progress: {
            status: STARTING,
            target: 0,
            progress: 0,
        },
        p: {
            t: identity,
            tc: identity,
            tu: identity,
            tm: identity,
        },
    };

    it('should render closed dialog if status is PENDING', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                status: PENDING,
            },
        };
        const wrapper = shallow(<Progress {...props} />);

        const dialog = wrapper.find(Dialog);
        expect(dialog.prop('open')).toBe(false);
    });

    it('should render opened dialog if status is not PENDING', () => {
        const wrapper = shallow(<Progress {...defaultProps} />);

        const dialog = wrapper.find(Dialog);
        expect(dialog.prop('open')).toBe(true);
    });

    it('should render progressBar', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: 1000,
                progress: 700,
            },
        };
        const wrapper = shallow(<Progress {...props} />);

        const linearProgress = wrapper.find(LinearProgress);
        expect(linearProgress.prop('value')).toBe(70);
        expect(linearProgress.prop('variant')).toBe('determinate');
        expect(wrapper.find('.progress p').text()).toBe('700 / 1000');
    });

    it('should render progress with no target', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: null,
                progress: 700,
            },
        };
        const wrapper = shallow(<Progress {...props} />);
        expect(wrapper.find('.progress p').text()).toBe('700');
    });

    it('should render progress with no target and text', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: null,
                progress: 700,
                label: 'lines',
            },
        };
        const wrapper = shallow(<Progress {...props} />);
        expect(wrapper.find('.progress p').text()).toBe('700 lines');
    });

    it('should render the symbol if specified', () => {
        const props = {
            ...defaultProps,
            progress: {
                ...defaultProps.progress,
                target: 100,
                progress: 70,
                symbol: '%',
            },
        };
        const wrapper = shallow(<Progress {...props} />);

        const linearProgress = wrapper.find(LinearProgress);
        expect(linearProgress.prop('value')).toBe(70);
        expect(linearProgress.prop('variant')).toBe('determinate');
        expect(wrapper.find('.progress p').text()).toBe('70 / 100 %');
    });
});
