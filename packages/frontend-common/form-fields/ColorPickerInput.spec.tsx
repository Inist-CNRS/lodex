import { act, screen, within } from '@testing-library/react';
import { render, userEvent } from '../test-utils';
import { ColorPickerInput } from './ColorPickerInput';

describe('ColorPickerInput', () => {
    it('should render color picker and text input', () => {
        const mockOnChange = jest.fn();

        render(
            <ColorPickerInput
                label="Test Color"
                value="#FF5733"
                onChange={mockOnChange}
            />,
        );

        const group = screen.getByRole('group', { name: 'Test Color' });
        const colorInput = within(group).getByLabelText('color_picker');
        const textInput = within(group).getByRole('textbox', {
            name: 'Test Color',
        });

        expect(colorInput).toBeInTheDocument();
        expect(colorInput).toHaveAttribute('type', 'color');
        expect(textInput).toBeInTheDocument();
        expect(textInput).toHaveAttribute('type', 'text');
    });

    it('should render with empty value', () => {
        const mockOnChange = jest.fn();

        render(<ColorPickerInput label="Test Color" onChange={mockOnChange} />);

        const group = screen.getByRole('group', { name: 'Test Color' });
        const textInput = within(group).getByRole('textbox', {
            name: 'Test Color',
        });
        expect(textInput).toHaveValue('');
    });

    it.each([
        { value: '#FF5733', expected: '#FF5733', label: 'valid hex color' },
        { value: '#000000', expected: '#000000', label: 'black color' },
        { value: '#FFFFFF', expected: '#FFFFFF', label: 'white color' },
        { value: '#abc123', expected: '#abc123', label: 'lowercase hex' },
    ])(
        'should render with $label',
        ({ value, expected }: { value: string; expected: string }) => {
            const mockOnChange = jest.fn();

            render(
                <ColorPickerInput
                    label="Test Color"
                    value={value}
                    onChange={mockOnChange}
                />,
            );

            const group = screen.getByRole('group', { name: 'Test Color' });
            const textInput = within(group).getByRole('textbox', {
                name: 'Test Color',
            });
            expect(textInput).toHaveValue(expected);
        },
    );

    it.each([
        {
            value: '#FF5733',
            expectedBg: '#FF5733',
            label: 'valid hex color',
        },
        {
            value: '#000000',
            expectedBg: '#000000',
            label: 'black color',
        },
        {
            value: 'invalid',
            expectedBg: '#000000',
            label: 'invalid color (defaults to black)',
        },
        {
            value: '#FFF',
            expectedBg: '#000000',
            label: 'short hex (defaults to black)',
        },
        {
            value: 'rgb(255, 0, 0)',
            expectedBg: '#000000',
            label: 'rgb format (defaults to black)',
        },
        {
            value: '',
            expectedBg: '#000000',
            label: 'empty string (defaults to black)',
        },
    ])('should set background color for $label', ({ value, expectedBg }) => {
        const mockOnChange = jest.fn();

        render(
            <ColorPickerInput
                label="Test Color"
                value={value}
                onChange={mockOnChange}
            />,
        );

        const group = screen.getByRole('group', { name: 'Test Color' });
        const colorInput = within(group).getByLabelText('color_picker');

        expect(colorInput.parentElement).toHaveStyle({
            backgroundColor: expectedBg,
        });
    });

    it('should call onChange when typing in text input', async () => {
        const mockOnChange = jest.fn();
        const user = userEvent.setup();

        render(
            <ColorPickerInput
                label="Test Color"
                value="#FF5733"
                onChange={mockOnChange}
            />,
        );

        const group = screen.getByRole('group', { name: 'Test Color' });
        const textInput = within(group).getByRole('textbox', {
            name: 'Test Color',
        });
        await act(async () => {
            await user.type(textInput, '6');
        });

        expect(mockOnChange).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenCalledWith('#FF57336');
    });

    it('should handle clearing text input', async () => {
        const mockOnChange = jest.fn();
        const user = userEvent.setup();

        render(
            <ColorPickerInput
                label="Test Color"
                value="#FF5733"
                onChange={mockOnChange}
            />,
        );

        const group = screen.getByRole('group', { name: 'Test Color' });
        const textInput = within(group).getByRole('textbox', {
            name: 'Test Color',
        });
        await act(async () => {
            await user.clear(textInput);
        });

        expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('should handle undefined value', () => {
        const mockOnChange = jest.fn();

        render(
            <ColorPickerInput
                label="Test Color"
                value={undefined}
                onChange={mockOnChange}
            />,
        );

        const group = screen.getByRole('group', { name: 'Test Color' });
        const textInput = within(group).getByRole('textbox', {
            name: 'Test Color',
        });
        expect(textInput).toHaveValue('');
    });

    it('should display the same value in both inputs for valid hex', () => {
        const mockOnChange = jest.fn();

        render(
            <ColorPickerInput
                label="Test Color"
                value="#FF5733"
                onChange={mockOnChange}
            />,
        );

        const group = screen.getByRole('group', { name: 'Test Color' });
        const colorInput = within(group).getByLabelText(
            'color_picker',
        ) as HTMLInputElement;
        const textInput = within(group).getByRole('textbox', {
            name: 'Test Color',
        });

        expect(colorInput.value.toLowerCase()).toBe('#ff5733');
        expect(textInput).toHaveValue('#FF5733');
    });

    it('should allow invalid color in text input while color picker shows black', () => {
        const mockOnChange = jest.fn();

        render(
            <ColorPickerInput
                label="Test Color"
                value="invalid-color"
                onChange={mockOnChange}
            />,
        );

        const group = screen.getByRole('group', { name: 'Test Color' });
        const textInput = within(group).getByRole('textbox', {
            name: 'Test Color',
        });
        expect(textInput).toHaveValue('invalid-color');

        const colorInput = within(group).getByLabelText('color_picker');
        expect(colorInput.parentElement).toHaveStyle({
            backgroundColor: '#000000',
        });
    });
});
