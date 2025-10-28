import { render, act, fireEvent } from '@testing-library/react';

import { FieldAddDropdownButtonComponent as FieldAddDropdownButton } from './FieldAddDropdownButton';
import { TestI18N } from '../../../../src/app/js/i18n/I18NContext';

describe('<FieldAddDropdownButton />', () => {
    // @ts-expect-error TS7034
    let mockAddField, mockShowAddFromColumn;
    beforeEach(() => {
        mockAddField = jest.fn();
        mockShowAddFromColumn = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call addField on click', () => {
        const screen = render(
            <TestI18N>
                <FieldAddDropdownButton
                    // @ts-expect-error TS7005
                    onAddNewField={mockAddField}
                    // @ts-expect-error TS7005
                    onShowExistingColumns={mockShowAddFromColumn}
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(screen.getByText('new_field'));
        });
        // @ts-expect-error TS7005
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: undefined,
        });
    });

    it('should call addField on click on blank field dropdown', () => {
        const screen = render(
            <TestI18N>
                <FieldAddDropdownButton
                    // @ts-expect-error TS7005
                    onAddNewField={mockAddField}
                    // @ts-expect-error TS7005
                    onShowExistingColumns={mockShowAddFromColumn}
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('add-field-dropdown'));
        });
        act(() => {
            fireEvent.click(screen.getByText('blank_field'));
        });
        // @ts-expect-error TS7005
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: undefined,
        });
    });

    it('should call showAddFromColumn on click on existing column dropdown', () => {
        const screen = render(
            <TestI18N>
                <FieldAddDropdownButton
                    // @ts-expect-error TS7005
                    onAddNewField={mockAddField}
                    // @ts-expect-error TS7005
                    onShowExistingColumns={mockShowAddFromColumn}
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('add-field-dropdown'));
        });
        act(() => {
            fireEvent.click(screen.getByText('from_original_dataset'));
        });
        // @ts-expect-error TS7005
        expect(mockShowAddFromColumn).toHaveBeenCalled();
    });

    it('should call addField with subresourceId on click if subresourceId is defined', () => {
        const screen = render(
            <TestI18N>
                <FieldAddDropdownButton
                    // @ts-expect-error TS7005
                    onAddNewField={mockAddField}
                    // @ts-expect-error TS7005
                    onShowExistingColumns={mockShowAddFromColumn}
                    subresourceId="1"
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(screen.getByText('new_field'));
        });
        // @ts-expect-error TS7005
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: '1',
        });
    });

    it('should call addField with subresourceId on click on blank field dropdown if subresourceId is defined', () => {
        const screen = render(
            <TestI18N>
                <FieldAddDropdownButton
                    // @ts-expect-error TS7005
                    onAddNewField={mockAddField}
                    // @ts-expect-error TS7005
                    onShowExistingColumns={mockShowAddFromColumn}
                    subresourceId="1"
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('add-field-dropdown'));
        });
        act(() => {
            fireEvent.click(screen.getByText('blank_field'));
        });
        // @ts-expect-error TS7005
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: '1',
        });
    });
});
