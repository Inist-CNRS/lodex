import { render } from '../../../src/test-utils';
import { SaveButton } from './SaveButton';
import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext';

describe('SaveButton', () => {
    it('should render a save button without icon when isFormModified=false', () => {
        const screen = render(
            <TestI18N>
                {/*
                 // @ts-expect-error TS2322 */}
                <SaveButton onSave={() => {}} isFormModified={false} />
            </TestI18N>,
        );
        expect(screen.getByText('save')).toBeInTheDocument();
        expect(
            screen.queryByLabelText('form_is_modified'),
        ).not.toBeInTheDocument();
    });
    it('should render a save button with icon when isFormModified=true', () => {
        const screen = render(
            <TestI18N>
                {/*
                 // @ts-expect-error TS2322 */}
                <SaveButton onSave={() => {}} isFormModified={true} />
            </TestI18N>,
        );
        expect(screen.getByText('save')).toBeInTheDocument();
        expect(screen.queryByLabelText('form_is_modified')).toBeInTheDocument();
    });
});
