import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import { AdminOnlyAlertComponent } from './AdminOnlyAlert';

describe('<AdminOnlyAlert />', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render its children when isAdmin is true', () => {
        const wrapper = shallow(
            <AdminOnlyAlertComponent isAdmin={true}>
                <p>foo</p>
            </AdminOnlyAlertComponent>,
        );
        expect(wrapper.contains(<p>foo</p>)).toEqual(true);
    });

    it('should not render its children when isAdmin is false', () => {
        const wrapper = shallow(
            <AdminOnlyAlertComponent isAdmin={false}>
                <p>foo</p>
            </AdminOnlyAlertComponent>,
        );
        expect(wrapper.contains(<p>foo</p>)).toEqual(false);
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
