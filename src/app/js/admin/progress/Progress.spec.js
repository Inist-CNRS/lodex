import React from 'react';
import { shallow } from 'enzyme';
import { Dialog, LinearProgress } from '@material-ui/core';

import { Progress } from './Progress';
import { PENDING, STARTING } from '../../../../common/progressStatus';

const identity = x => x;

describe('Progress', () => {
    const defaultProps = {
        loadProgress: () => null,
        status: STARTING,
        target: 0,
        progress: 0,
        p: {
            t: identity,
            tc: identity,
            tu: identity,
            tm: identity,
        },
    };

    it('should render closed dialog if status is PENDING', () => {
        const wrapper = shallow(
            <Progress {...defaultProps} status={PENDING} />,
        );

        const dialog = wrapper.find(Dialog);
        expect(dialog.prop('open')).toBe(false);
    });

    it('should render opened dialog if status is not PENDING', () => {
        const wrapper = shallow(
            <Progress {...defaultProps} status={STARTING} />,
        );

        const dialog = wrapper.find(Dialog);
        expect(dialog.prop('open')).toBe(true);
    });

    it('should render progressBar', () => {
        const wrapper = shallow(
            <Progress {...defaultProps} target={1000} progress={700} />,
        );

        const linearProgress = wrapper.find(LinearProgress);
        expect(linearProgress.prop('max')).toBe(1000);
        expect(linearProgress.prop('value')).toBe(700);
        expect(linearProgress.prop('mode')).toBe('determinate');
        expect(wrapper.find('.progress p').text()).toBe('700 / 1000');
    });

    it('should render the symbol if specified', () => {
        const wrapper = shallow(
            <Progress
                {...defaultProps}
                progress={70}
                target={100}
                symbol="%"
            />,
        );

        const linearProgress = wrapper.find(LinearProgress);
        expect(linearProgress.prop('value')).toBe(70);
        expect(linearProgress.prop('max')).toBe(100);
        expect(linearProgress.prop('mode')).toBe('determinate');
        expect(wrapper.find('.progress p').text()).toBe('70 / 100 %');
    });
});
