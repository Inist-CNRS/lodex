import { act, screen, waitFor, within } from '@testing-library/react';
import { render, userEvent } from '../../../test-utils';
import { ColorScaleInput, type ColorScaleItem } from './ColorScaleInput';

describe('ColorScaleInput', () => {
    it('should render with empty initial value', () => {
        const mockOnChange = jest.fn();

        render(<ColorScaleInput value={undefined} onChange={mockOnChange} />);

        const colorInput = screen.getByLabelText('color_picker');
        const valuesInput = screen.getByRole('textbox', { name: 'values' });

        expect(colorInput).toBeInTheDocument();
        expect(colorInput).toHaveValue('#000000');
        expect(valuesInput).toBeInTheDocument();
        expect(valuesInput).toHaveValue('');
    });

    it('should render with initial value', () => {
        const mockOnChange = jest.fn();
        const initialValue: ColorScaleItem = {
            color: '#FF5733',
            values: 'value1\nvalue2',
        };

        render(
            <ColorScaleInput value={initialValue} onChange={mockOnChange} />,
        );

        const colorGroup = screen.getByRole('group', { name: 'Color' });
        const textInput = within(colorGroup).getByRole('textbox', {
            name: 'Color',
        });
        const valuesInput = screen.getByRole('textbox', { name: 'values' });

        expect(textInput).toHaveValue('#FF5733');
        expect(valuesInput).toHaveValue('value1\nvalue2');
    });

    it('should display helper text', () => {
        const mockOnChange = jest.fn();

        render(<ColorScaleInput value={undefined} onChange={mockOnChange} />);

        expect(screen.getByText('one_value_per_line')).toBeInTheDocument();
    });

    it.each([
        {
            label: 'color changes',
            inputType: 'color',
            typeValue: '#00FF00',
            expectedMatch: { color: '#00FF00' },
        },
        {
            label: 'values change',
            inputType: 'values',
            typeValue: 'test1\ntest2',
            expectedMatch: { values: 'test1\ntest2' },
        },
    ])(
        'should call onChange when $label',
        async ({ inputType, typeValue, expectedMatch }) => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <ColorScaleInput value={undefined} onChange={mockOnChange} />,
            );

            let input: HTMLElement;
            if (inputType === 'color') {
                const colorGroup = screen.getByRole('group', { name: 'Color' });
                input = within(colorGroup).getByRole('textbox', {
                    name: 'Color',
                });
                await act(async () => {
                    await user.clear(input);
                });
            } else {
                input = screen.getByRole('textbox', { name: 'values' });
            }

            await act(async () => {
                await user.type(input, typeValue);
            });

            await waitFor(() => {
                expect(mockOnChange).toHaveBeenLastCalledWith(
                    expect.objectContaining(expectedMatch),
                );
            });
        },
    );

    it('should update both color and values independently', async () => {
        const user = userEvent.setup();
        const mockOnChange = jest.fn();

        render(<ColorScaleInput value={undefined} onChange={mockOnChange} />);

        const colorGroup = screen.getByRole('group', { name: 'Color' });
        const colorTextInput = within(colorGroup).getByRole('textbox', {
            name: 'Color',
        });
        const valuesInput = screen.getByRole('textbox', { name: 'values' });

        await act(async () => {
            await user.clear(colorTextInput);
            await user.type(colorTextInput, '#FF0000');
        });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
        });

        await act(async () => {
            await user.type(valuesInput, 'value1');
        });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    color: '#FF0000',
                    values: 'value1',
                }),
            );
        });
    });

    it('should debounce onChange calls', async () => {
        const user = userEvent.setup();
        const mockOnChange = jest.fn();

        render(<ColorScaleInput value={undefined} onChange={mockOnChange} />);

        const valuesInput = screen.getByRole('textbox', { name: 'values' });

        await act(async () => {
            await user.type(valuesInput, 'a');
            await user.type(valuesInput, 'b');
            await user.type(valuesInput, 'c');
        });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
        });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should handle multiline text input', async () => {
        const user = userEvent.setup();
        const mockOnChange = jest.fn();

        render(<ColorScaleInput value={undefined} onChange={mockOnChange} />);

        const valuesInput = screen.getByRole('textbox', { name: 'values' });

        expect(valuesInput).toHaveAttribute('aria-multiline', 'true');

        await act(async () => {
            await user.type(valuesInput, 'line1\nline2\nline3');
        });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    values: expect.stringContaining('\n'),
                }),
            );
        });
    });

    it.each([
        {
            label: 'updating only color',
            initialValue: {
                color: '#000000',
                values: 'existing\nvalues',
            },
            updateType: 'color',
            newValue: '#FFFFFF',
            expectedMatch: {
                color: '#FFFFFF',
                values: 'existing\nvalues',
            },
        },
        {
            label: 'updating only values',
            initialValue: {
                color: '#FF5733',
                values: 'initial',
            },
            updateType: 'values',
            newValue: 'updated',
            expectedMatch: {
                color: '#FF5733',
                values: 'updated',
            },
        },
    ])(
        'should preserve existing value when $label',
        async ({ initialValue, updateType, newValue, expectedMatch }) => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <ColorScaleInput
                    value={initialValue}
                    onChange={mockOnChange}
                />,
            );

            let input: HTMLElement;
            if (updateType === 'color') {
                const colorGroup = screen.getByRole('group', { name: 'Color' });
                input = within(colorGroup).getByRole('textbox', {
                    name: 'Color',
                });
            } else {
                input = screen.getByRole('textbox', { name: 'values' });
            }

            await act(async () => {
                await user.clear(input);
                await user.type(input, newValue);
            });

            await waitFor(() => {
                expect(mockOnChange).toHaveBeenLastCalledWith(
                    expect.objectContaining(expectedMatch),
                );
            });
        },
    );

    it.each([
        {
            label: 'undefined initial value',
            initialValue: undefined,
            expectedColor: '#000000',
            expectedValues: '',
            useColorGroup: false,
        },
        {
            label: 'partial initial value with only color',
            initialValue: { color: '#123456' },
            expectedColor: '#123456',
            expectedValues: '',
            useColorGroup: true,
        },
        {
            label: 'partial initial value with only values',
            initialValue: { values: 'test\ndata' },
            expectedColor: '#000000',
            expectedValues: 'test\ndata',
            useColorGroup: false,
        },
    ])(
        'should handle $label',
        ({ initialValue, expectedColor, expectedValues, useColorGroup }) => {
            const mockOnChange = jest.fn();

            render(
                <ColorScaleInput
                    value={initialValue}
                    onChange={mockOnChange}
                />,
            );

            if (useColorGroup) {
                const colorGroup = screen.getByRole('group', { name: 'Color' });
                const textInput = within(colorGroup).getByRole('textbox', {
                    name: 'Color',
                });
                expect(textInput).toHaveValue(expectedColor);
            } else {
                const colorInput = screen.getByLabelText('color_picker');
                expect(colorInput).toHaveValue(expectedColor);
            }

            const valuesInput = screen.getByRole('textbox', { name: 'values' });
            expect(valuesInput).toHaveValue(expectedValues);
        },
    );
});
