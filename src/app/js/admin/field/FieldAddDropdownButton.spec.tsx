import { render, act } from '@testing-library/react';

import { FieldAddDropdownButtonComponent as FieldAddDropdownButton } from './FieldAddDropdownButton';
import { TestI18N } from '../../i18n/I18NContext';

describe('<FieldAddDropdownButton />', () => {
    // @ts-expect-error TS7034
    let mockAddField, mockShowAddFromColumn, polyglot;
    beforeEach(() => {
        mockAddField = jest.fn();
        mockShowAddFromColumn = jest.fn();
        polyglot = {
            // @ts-expect-error TS7006
            t: (key) => key,
        };
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
                    // @ts-expect-error TS2322
                    p={polyglot}
                />
            </TestI18N>,
        );

        act(() => {
            screen.fireEvent.click(screen.getByText('new_field'));
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
                    // @ts-expect-error TS2322
                    p={polyglot}
                />
            </TestI18N>,
        );

        act(() => {
            screen.fireEvent.click(screen.getByTestId('add-field-dropdown'));
        });
        act(() => {
            screen.fireEvent.click(screen.getByText('blank_field'));
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
                    // @ts-expect-error TS2322
                    p={polyglot}
                />
            </TestI18N>,
        );

        act(() => {
            screen.fireEvent.click(screen.getByTestId('add-field-dropdown'));
        });
        act(() => {
            screen.fireEvent.click(screen.getByText('from_original_dataset'));
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
                    // @ts-expect-error TS2322
                    p={polyglot}
                    subresourceId="1"
                />
            </TestI18N>,
        );

        act(() => {
            screen.fireEvent.click(screen.getByText('new_field'));
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
                    // @ts-expect-error TS2322
                    p={polyglot}
                    subresourceId="1"
                />
            </TestI18N>,
        );

        act(() => {
            screen.fireEvent.click(screen.getByTestId('add-field-dropdown'));
        });
        act(() => {
            screen.fireEvent.click(screen.getByText('blank_field'));
        });
        // @ts-expect-error TS7005
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: '1',
        });
    });
});
