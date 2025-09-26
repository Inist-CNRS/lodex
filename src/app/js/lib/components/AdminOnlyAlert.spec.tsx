import React from 'react';
import { shallow } from 'enzyme';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';

import { AdminOnlyAlertComponent } from './AdminOnlyAlert';

describe('<AdminOnlyAlert />', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render its children when isAdmin is true', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <AdminOnlyAlertComponent isAdmin={true}>
                {/*
                 // @ts-expect-error TS2322 */}
                <p>foo</p>
            </AdminOnlyAlertComponent>,
        );
        // @ts-expect-error TS2345
        expect(wrapper.contains(<p>foo</p>)).toBe(true);
    });

    it('should not render its children when isAdmin is false', () => {
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <AdminOnlyAlertComponent isAdmin={false}>
                {/*
                 // @ts-expect-error TS2322 */}
                <p>foo</p>
            </AdminOnlyAlertComponent>,
        );
        // @ts-expect-error TS2345
        expect(wrapper.contains(<p>foo</p>)).toBe(false);
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
