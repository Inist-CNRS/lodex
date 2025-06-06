import React from 'react';

import { render, screen } from '../../../../test-utils';
import { SaveButton } from './SaveButton';
import { TestI18N } from '../../i18n/I18NContext';

describe('SaveButton', () => {
    it('should render a save button without icon when isFormModified=false', () => {
        render(
            <TestI18N>
                <SaveButton onSave={() => {}} isFormModified={false} />
            </TestI18N>,
        );
        expect(screen.getByText('save')).toBeInTheDocument();
        expect(
            screen.queryByLabelText('form_is_modified'),
        ).not.toBeInTheDocument();
    });
    it('should render a save button with icon when isFormModified=true', () => {
        render(
            <TestI18N>
                <SaveButton onSave={() => {}} isFormModified={true} />
            </TestI18N>,
        );
        expect(screen.getByText('save')).toBeInTheDocument();
        expect(screen.queryByLabelText('form_is_modified')).toBeInTheDocument();
    });
});
