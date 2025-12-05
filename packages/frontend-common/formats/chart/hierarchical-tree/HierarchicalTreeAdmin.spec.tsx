import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { act, render } from '../../../test-utils';
import HierarchicalTreeAdmin, { defaultArgs } from './HierarchicalTreeAdmin';

jest.mock('../../../fields/api/useListField', () => ({
    useListField: jest.fn(() => ({
        isFieldListPending: false,
        fields: [
            {
                _id: 'field1',
                name: 'field1',
                label: 'Field 1',
                scope: 'document',
            },
            {
                _id: 'field2',
                name: 'field2',
                label: 'Field 2',
                scope: 'document',
            },
        ],
    })),
}));

describe('<HierarchicalTreeAdmin />', () => {
    it('should have accessible labels for all form controls', () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        expect(
            screen.getByRole('radiogroup', { name: 'orientation' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('radio', { name: 'orientation_horizontal' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('radio', { name: 'orientation_vertical' }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('node_width')).toBeInTheDocument();
        expect(screen.getByLabelText('node_height')).toBeInTheDocument();
        expect(
            screen.getByLabelText('space_between_nodes'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('initial_zoom')).toBeInTheDocument();
        expect(screen.getByLabelText('initial_depth')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for radio groups', () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const orientationGroup = screen.getByRole('radiogroup', {
            name: 'orientation',
        });
        expect(orientationGroup).toHaveAttribute('aria-label', 'orientation');
    });

    it('should display default values when no args provided', () => {
        const mockOnChange = jest.fn();
        render(<HierarchicalTreeAdmin onChange={mockOnChange} />);

        expect(
            screen.getByRole('radio', { name: 'orientation_horizontal' }),
        ).toBeChecked();
        expect(
            screen.getByRole('radio', { name: 'orientation_vertical' }),
        ).not.toBeChecked();
        expect(screen.getByLabelText('node_width')).toHaveValue(
            defaultArgs.nodeWidth,
        );
        expect(screen.getByLabelText('node_height')).toHaveValue(
            defaultArgs.nodeHeight,
        );
        expect(screen.getByLabelText('space_between_nodes')).toHaveValue(
            defaultArgs.spaceBetweenNodes,
        );
        expect(screen.getByLabelText('initial_zoom')).toHaveValue(
            defaultArgs.initialZoom,
        );
        expect(screen.getByLabelText('initial_depth')).toHaveValue(
            defaultArgs.initialDepth,
        );
        expect(screen.getByLabelText('minimum_scale_value')).toHaveValue(
            defaultArgs.minimumScaleValue,
        );
        expect(screen.getByLabelText('maximum_scale_value')).toHaveValue(
            defaultArgs.maximumScaleValue,
        );
    });

    it('should merge provided args with defaults', () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={{
                    orientation: 'vertical',
                    nodeWidth: 200,
                }}
                onChange={mockOnChange}
            />,
        );

        expect(
            screen.getByRole('radio', { name: 'orientation_vertical' }),
        ).toBeChecked();
        expect(screen.getByLabelText('node_width')).toHaveValue(200);
        expect(screen.getByLabelText('node_height')).toHaveValue(
            defaultArgs.nodeHeight,
        );
    });

    it('should handle vertical orientation selection', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const radio = screen.getByRole('radio', {
            name: 'orientation_vertical',
        });

        await act(async () => {
            fireEvent.click(radio);
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                orientation: 'vertical',
            }),
        );
    });

    it('should start with horizontal orientation selected by default', () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const horizontalRadio = screen.getByRole('radio', {
            name: 'orientation_horizontal',
        });
        expect(horizontalRadio).toBeChecked();
    });

    it('should update nodeWidth when node_width changes', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('node_width');

        await act(async () => {
            fireEvent.change(input, { target: { value: '150' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                nodeWidth: 150,
            }),
        );
    });

    it('should update nodeHeight when node_height changes', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('node_height');

        await act(async () => {
            fireEvent.change(input, { target: { value: '75' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                nodeHeight: 75,
            }),
        );
    });

    it('should set nodeWidth to null when node_width is empty', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('node_width');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                nodeWidth: null,
            }),
        );
    });

    it('should set nodeHeight to null when node_height is empty', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('node_height');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                nodeHeight: null,
            }),
        );
    });

    it('should accept only numeric values for dimensions', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const widthInput = screen.getByLabelText('node_width');

        await act(async () => {
            fireEvent.change(widthInput, { target: { value: '123' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                nodeWidth: 123,
            }),
        );
    });

    it('should display color picker with default color', () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const colorInput = screen.getByRole('textbox', {
            name: 'default_color',
        });
        expect(colorInput).toBeInTheDocument();
        expect(colorInput).toHaveValue(defaultArgs.colors);
    });

    it('should update color when changed', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const colorInput = screen.getByRole('textbox', {
            name: 'default_color',
        });

        await act(async () => {
            fireEvent.change(colorInput, { target: { value: '#FF5733' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                colors: '#FF5733',
            }),
        );
    });

    it('should show max size field when showMaxSize is true', () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
                showMaxSize
            />,
        );

        const field = screen.queryByLabelText('max_fields');
        expect(field).toBeInTheDocument();
    });

    it('should hide max size field when showMaxSize is false', () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
                showMaxSize={false}
            />,
        );

        const field = screen.queryByLabelText('max_fields');
        expect(field).not.toBeInTheDocument();
    });

    it('should handle params changes through RoutineParamsAdmin', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
                showMaxSize
            />,
        );

        const maxSizeInput = screen.getByLabelText('max_fields');

        await act(async () => {
            fireEvent.change(maxSizeInput, { target: { value: '1000' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                params: expect.objectContaining({
                    maxSize: '1000',
                }),
            }),
        );
    });

    it('should show orderBy controls when showOrderBy is true', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
                showOrderBy
            />,
        );

        const dataParamsButton = screen.getByRole('button', {
            name: 'format_data_params',
        });

        await act(async () => {
            fireEvent.click(dataParamsButton);
        });

        expect(screen.getByText('order_by')).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(6);
    });

    it('should preserve all existing args when updating single field', async () => {
        const mockOnChange = jest.fn();
        const customArgs = {
            params: {
                maxSize: 100,
                orderBy: 'value/desc',
            },
            orientation: 'vertical' as const,
            nodeWidth: 200,
            nodeHeight: 150,
            colors: '#FF0000',
        };

        render(
            <HierarchicalTreeAdmin args={customArgs} onChange={mockOnChange} />,
        );

        const widthInput = screen.getByLabelText('node_width');

        await act(async () => {
            fireEvent.change(widthInput, { target: { value: '250' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...customArgs,
            nodeWidth: 250,
        });
    });

    it('should preserve params when updating chart settings', async () => {
        const mockOnChange = jest.fn();
        const customArgs = {
            params: {
                maxSize: 500,
                orderBy: 'value/asc',
            },
            orientation: 'horizontal' as const,
            nodeWidth: 100,
            nodeHeight: 100,
            colors: '#00FF00',
        };

        render(
            <HierarchicalTreeAdmin args={customArgs} onChange={mockOnChange} />,
        );

        const verticalRadio = screen.getByRole('radio', {
            name: 'orientation_vertical',
        });

        await act(async () => {
            fireEvent.click(verticalRadio);
        });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...customArgs,
            orientation: 'vertical',
        });
    });

    it('should handle complete configuration workflow', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
                showMaxSize
                showOrderBy
            />,
        );

        const maxSizeInput = screen.getByLabelText('max_fields');
        await act(async () => {
            fireEvent.change(maxSizeInput, { target: { value: '2000' } });
        });
        expect(mockOnChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                params: expect.objectContaining({
                    maxSize: '2000',
                }),
            }),
        );

        const verticalRadio = screen.getByRole('radio', {
            name: 'orientation_vertical',
        });
        await act(async () => {
            fireEvent.click(verticalRadio);
        });
        expect(mockOnChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                orientation: 'vertical',
            }),
        );

        const widthInput = screen.getByLabelText('node_width');
        await act(async () => {
            fireEvent.change(widthInput, { target: { value: '180' } });
        });
        expect(mockOnChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                nodeWidth: 180,
            }),
        );

        const colorInput = screen.getByRole('textbox', {
            name: 'default_color',
        });
        await act(async () => {
            fireEvent.change(colorInput, { target: { value: '#3498db' } });
        });
        expect(mockOnChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                colors: '#3498db',
            }),
        );

        expect(mockOnChange).toHaveBeenCalledTimes(4);
    });

    it('should update spaceBetweenNodes when space_between_nodes changes', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('space_between_nodes');

        await act(async () => {
            fireEvent.change(input, { target: { value: '50' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                spaceBetweenNodes: 50,
            }),
        );
    });

    it('should set spaceBetweenNodes to null when space_between_nodes is empty', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('space_between_nodes');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                spaceBetweenNodes: null,
            }),
        );
    });

    it('should update initialZoom when initial_zoom changes', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('initial_zoom');

        await act(async () => {
            fireEvent.change(input, { target: { value: '1.5' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                initialZoom: 1.5,
            }),
        );
    });

    it('should set initialZoom to null when initial_zoom is empty', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('initial_zoom');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                initialZoom: null,
            }),
        );
    });

    it('should update initialDepth when initial_depth changes', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('initial_depth');

        await act(async () => {
            fireEvent.change(input, { target: { value: '5' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                initialDepth: 5,
            }),
        );
    });

    it('should set initialDepth to null when initial_depth is empty', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('initial_depth');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                initialDepth: null,
            }),
        );
    });

    it('should update minimumScaleValue when minimum_scale_value changes', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('minimum_scale_value');

        await act(async () => {
            fireEvent.change(input, { target: { value: '0.2' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                minimumScaleValue: 0.2,
            }),
        );
    });

    it('should set minimumScaleValue to null when minimum_scale_value is empty', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('minimum_scale_value');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                minimumScaleValue: null,
            }),
        );
    });

    it('should update maximumScaleValue when maximum_scale_value changes', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('maximum_scale_value');

        await act(async () => {
            fireEvent.change(input, { target: { value: '2.5' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                maximumScaleValue: 2.5,
            }),
        );
    });

    it('should set maximumScaleValue to null when maximum_scale_value is empty', async () => {
        const mockOnChange = jest.fn();
        render(
            <HierarchicalTreeAdmin
                args={defaultArgs}
                onChange={mockOnChange}
            />,
        );

        const input = screen.getByLabelText('maximum_scale_value');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                maximumScaleValue: null,
            }),
        );
    });
});
