import React from 'react';
import { shallow } from 'enzyme';
import { Dialog } from 'material-ui';
import expect from 'expect';

import { Progress } from './Progress';
import { PENDING, STARTING } from '../../../../common/progressStatus';
import LinearProgress from 'material-ui/LinearProgress';

describe('Progress', () => {
    const defaultProps = {
        loadProgress: () => null,
        status: STARTING,
        target: 0,
        progress: 0,
        p: {
            t: v => v,
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
        expect(wrapper.find('.progress').text()).toContain('700 / 1000');
    });
});
