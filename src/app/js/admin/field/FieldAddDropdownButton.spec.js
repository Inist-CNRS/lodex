import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { FieldAddDropdownButtonComponent as FieldAddDropdownButton } from './FieldAddDropdownButton';
import { TestI18N } from '../../i18n/I18NContext';

describe('<FieldAddDropdownButton />', () => {
    let mockAddField, mockShowAddFromColumn, polyglot;
    beforeEach(() => {
        mockAddField = jest.fn();
        mockShowAddFromColumn = jest.fn();
        polyglot = {
            t: (key) => key,
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call addField on click', () => {
        const { getByText } = render(
            <TestI18N>
                <FieldAddDropdownButton
                    onAddNewField={mockAddField}
                    onShowExistingColumns={mockShowAddFromColumn}
                    p={polyglot}
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(getByText('new_field'));
        });
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: undefined,
        });
    });

    it('should call addField on click on blank field dropdown', () => {
        const { getByTestId, getByText } = render(
            <TestI18N>
                <FieldAddDropdownButton
                    onAddNewField={mockAddField}
                    onShowExistingColumns={mockShowAddFromColumn}
                    p={polyglot}
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(getByTestId('add-field-dropdown'));
        });
        act(() => {
            fireEvent.click(getByText('blank_field'));
        });
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: undefined,
        });
    });

    it('should call showAddFromColumn on click on existing column dropdown', () => {
        const { getByTestId, getByText } = render(
            <TestI18N>
                <FieldAddDropdownButton
                    onAddNewField={mockAddField}
                    onShowExistingColumns={mockShowAddFromColumn}
                    p={polyglot}
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(getByTestId('add-field-dropdown'));
        });
        act(() => {
            fireEvent.click(getByText('from_original_dataset'));
        });
        expect(mockShowAddFromColumn).toHaveBeenCalled();
    });

    it('should call addField with subresourceId on click if subresourceId is defined', () => {
        const { getByText } = render(
            <TestI18N>
                <FieldAddDropdownButton
                    onAddNewField={mockAddField}
                    onShowExistingColumns={mockShowAddFromColumn}
                    p={polyglot}
                    subresourceId="1"
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(getByText('new_field'));
        });
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: '1',
        });
    });

    it('should call addField with subresourceId on click on blank field dropdown if subresourceId is defined', () => {
        const { getByTestId, getByText } = render(
            <TestI18N>
                <FieldAddDropdownButton
                    onAddNewField={mockAddField}
                    onShowExistingColumns={mockShowAddFromColumn}
                    p={polyglot}
                    subresourceId="1"
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(getByTestId('add-field-dropdown'));
        });
        act(() => {
            fireEvent.click(getByText('blank_field'));
        });
        expect(mockAddField).toHaveBeenCalledWith({
            scope: 'document',
            subresourceId: '1',
        });
    });
});
