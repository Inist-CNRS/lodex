import { act, screen, within } from '@testing-library/react';
import { render, userEvent } from '../../../test-utils';
import { ColorScaleGroup, type ColorScaleGroupProps } from './ColorScaleGroup';
import type { ColorScaleItemMaybe } from './ColorScaleInput';

if (typeof structuredClone === 'undefined') {
    global.structuredClone = (obj: unknown) => {
        if (obj === undefined) return undefined;
        return JSON.parse(JSON.stringify(obj));
    };
}

describe('ColorScaleGroup', () => {
    const defaultProps: ColorScaleGroupProps = {
        isAdvancedColorMode: false,
        colorScale: [],
        handleToggleAdvancedColors: jest.fn(),
        handleColorScaleChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        {
            label: 'unchecked when isAdvancedColorMode is false',
            isAdvancedColorMode: false,
            expectedChecked: false,
        },
        {
            label: 'checked when isAdvancedColorMode is true',
            isAdvancedColorMode: true,
            expectedChecked: true,
        },
        {
            label: 'unchecked when isAdvancedColorMode is undefined',
            isAdvancedColorMode: undefined,
            expectedChecked: false,
        },
    ])(
        'should render the advanced color mode switch $label',
        ({ isAdvancedColorMode, expectedChecked }) => {
            render(
                <ColorScaleGroup
                    {...defaultProps}
                    isAdvancedColorMode={isAdvancedColorMode}
                />,
            );

            const switchControl = screen.getByRole('checkbox', {
                name: 'advanced_color_mode',
            });

            expect(switchControl).toBeInTheDocument();
            if (expectedChecked) {
                expect(switchControl).toBeChecked();
            } else {
                expect(switchControl).not.toBeChecked();
            }
        },
    );

    it.each([
        {
            label: 'checking when initially unchecked',
            initialState: false,
            expectedCallValue: true,
        },
        {
            label: 'unchecking when initially checked',
            initialState: true,
            expectedCallValue: false,
        },
    ])(
        'should call handleToggleAdvancedColors with $expectedCallValue when $label',
        async ({ initialState, expectedCallValue }) => {
            const user = userEvent.setup();
            const mockToggle = jest.fn();

            render(
                <ColorScaleGroup
                    {...defaultProps}
                    isAdvancedColorMode={initialState}
                    handleToggleAdvancedColors={mockToggle}
                />,
            );

            const switchControl = screen.getByRole('checkbox', {
                name: 'advanced_color_mode',
            });

            await act(async () => {
                await user.click(switchControl);
            });

            expect(mockToggle).toHaveBeenCalledWith(expectedCallValue);
        },
    );

    it.each([
        {
            label: 'when isAdvancedColorMode is false',
            isAdvancedColorMode: false,
            shouldBeVisible: false,
        },
        {
            label: 'when isAdvancedColorMode is true',
            isAdvancedColorMode: true,
            shouldBeVisible: true,
        },
        {
            label: 'when colorScale is empty',
            isAdvancedColorMode: true,
            colorScale: [],
            shouldBeVisible: true,
        },
        {
            label: 'when colorScale is undefined',
            isAdvancedColorMode: true,
            colorScale: undefined,
            shouldBeVisible: true,
        },
    ])(
        'should render ArrayInput correctly $label',
        ({ isAdvancedColorMode, colorScale, shouldBeVisible }) => {
            render(
                <ColorScaleGroup
                    {...defaultProps}
                    isAdvancedColorMode={isAdvancedColorMode}
                    colorScale={colorScale}
                />,
            );

            const addButton = screen.queryByRole('button', {
                name: 'add_value',
            });

            if (shouldBeVisible) {
                expect(addButton).toBeInTheDocument();
            } else {
                expect(addButton).not.toBeInTheDocument();
            }
        },
    );

    it.each([
        {
            label: 'with 2 items having values',
            colorScale: [
                { color: '#FF0000', values: 'red\ncrimson' },
                { color: '#00FF00', values: 'green\nlime' },
            ],
            expectedCount: 2,
            expectedColors: ['#FF0000', '#00FF00'],
            expectedValues: ['red\ncrimson', 'green\nlime'],
        },
        {
            label: 'with 3 items',
            colorScale: [
                { color: '#FF0000', values: 'value1' },
                { color: '#00FF00', values: 'value2' },
                { color: '#0000FF', values: 'value3' },
            ],
            expectedCount: 3,
            expectedColors: ['#FF0000', '#00FF00', '#0000FF'],
            expectedValues: ['value1', 'value2', 'value3'],
        },
        {
            label: 'with undefined values in colorScale',
            colorScale: [
                { color: '#FF0000', values: 'red' },
                undefined,
                { color: '#00FF00', values: 'green' },
            ],
            expectedCount: 3,
            checkValues: false,
        },
    ])(
        'should render ColorScaleInput items correctly $label',
        ({
            colorScale,
            expectedCount,
            expectedColors,
            expectedValues,
            checkValues = true,
        }) => {
            render(
                <ColorScaleGroup
                    {...defaultProps}
                    isAdvancedColorMode={true}
                    colorScale={colorScale}
                />,
            );

            const removeButtons = screen.getAllByRole('button', {
                name: 'remove',
            });
            expect(removeButtons).toHaveLength(expectedCount);

            if (checkValues && expectedColors && expectedValues) {
                const colorGroups = screen.getAllByRole('group', {
                    name: 'Color',
                });
                expect(colorGroups).toHaveLength(expectedCount);

                expectedColors.forEach((color, index) => {
                    const colorInput = within(colorGroups[index]).getByRole(
                        'textbox',
                        {
                            name: 'Color',
                        },
                    );
                    expect(colorInput).toHaveValue(color);
                });

                const valuesInputs = screen.getAllByRole('textbox', {
                    name: 'values',
                });
                expect(valuesInputs).toHaveLength(expectedCount);

                expectedValues.forEach((value, index) => {
                    expect(valuesInputs[index]).toHaveValue(value);
                });
            }
        },
    );

    it('should call handleColorScaleChange when adding a new item', async () => {
        const user = userEvent.setup();
        const mockHandleChange = jest.fn();

        render(
            <ColorScaleGroup
                {...defaultProps}
                isAdvancedColorMode={true}
                colorScale={[]}
                handleColorScaleChange={mockHandleChange}
            />,
        );

        const addButton = screen.getByRole('button', { name: 'add_value' });

        await act(async () => {
            await user.click(addButton);
        });

        expect(mockHandleChange).toHaveBeenCalledWith([undefined]);
    });

    it('should call handleColorScaleChange when removing an item', async () => {
        const user = userEvent.setup();
        const mockHandleChange = jest.fn();
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'red' },
            { color: '#00FF00', values: 'green' },
        ];

        render(
            <ColorScaleGroup
                {...defaultProps}
                isAdvancedColorMode={true}
                colorScale={colorScale}
                handleColorScaleChange={mockHandleChange}
            />,
        );

        const removeButtons = screen.getAllByRole('button', {
            name: 'remove',
        });

        await act(async () => {
            await user.click(removeButtons[0]);
        });

        expect(mockHandleChange).toHaveBeenCalledWith([
            { color: '#00FF00', values: 'green' },
        ]);
    });

    it('should toggle between showing and hiding ArrayInput', () => {
        const mockToggle = jest.fn();

        const { rerender } = render(
            <ColorScaleGroup
                {...defaultProps}
                isAdvancedColorMode={false}
                handleToggleAdvancedColors={mockToggle}
            />,
        );

        expect(
            screen.queryByRole('button', { name: 'add_value' }),
        ).not.toBeInTheDocument();

        rerender(
            <ColorScaleGroup
                {...defaultProps}
                isAdvancedColorMode={true}
                handleToggleAdvancedColors={mockToggle}
            />,
        );

        expect(
            screen.getByRole('button', { name: 'add_value' }),
        ).toBeInTheDocument();
    });
});
