import React from 'react';
import { ExportDatasetButtonComponent } from './ExportDatasetButton';
import { fireEvent, render, screen } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';

const TestExportDatasetButton = (props) => {
    return (
        <TestI18N>
            <ExportDatasetButtonComponent
                fields={[
                    {
                        name: 'field1',
                        label: 'label 1',
                    },
                    {
                        name: 'field2',
                        label: 'label 2',
                    },
                    {
                        name: 'field3',
                        label: 'label 3',
                    },
                ]}
                {...props}
            />
        </TestI18N>
    );
};

describe('ExportDatasetButton', () => {
    it('should render a export button, opening a model with all fields preselected, confirming call dumpDataset with them', () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        expect(screen.getByText('export_raw_dataset')).toBeInTheDocument();
        expect(screen.getByText('export_raw_dataset')).not.toBeDisabled();
        fireEvent.click(screen.getByText('export_raw_dataset'));
        expect(
            screen.getByText('what_data_do_you_want_to_export'),
        ).toBeInTheDocument();

        expect(screen.getByText('export_choose_fields')).toBeInTheDocument();
        expect(screen.getByText('label 1')).toBeInTheDocument();
        expect(screen.getByText('label 2')).toBeInTheDocument();
        expect(screen.getByText('label 3')).toBeInTheDocument();

        fireEvent.click(screen.getByText('confirm'));

        expect(dumpDataset).toHaveBeenCalledWith([
            'field1',
            'field2',
            'field3',
        ]);
    });

    it('should allow to unselect some field before export', () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        fireEvent.click(screen.getByText('export_raw_dataset'));

        fireEvent.mouseDown(screen.getByLabelText('export_choose_fields'));
        fireEvent.click(screen.getByRole('option', { name: 'label 1' }));
        fireEvent.click(screen.getByText('confirm'));

        expect(dumpDataset).toHaveBeenCalledWith(['field2', 'field3']);
    });

    it('should allow to unselect all field with the clear_all button, this disable the confirm button, until at least one is selected', () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        fireEvent.click(screen.getByText('export_raw_dataset'));
        expect(screen.getByText('confirm')).not.toBeDisabled();

        fireEvent.click(screen.getByTitle('clear_all'));
        expect(screen.getByText('confirm')).toBeDisabled();

        fireEvent.mouseDown(screen.getByLabelText('export_choose_fields'));
        fireEvent.click(screen.getByRole('option', { name: 'label 1' }));
        fireEvent.click(screen.getByText('confirm'));

        expect(dumpDataset).toHaveBeenCalledWith(['field1']);
    });

    it('should allow to readd all field with the select_all button', () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        fireEvent.click(screen.getByText('export_raw_dataset'));
        fireEvent.click(screen.getByTitle('clear_all'));

        expect(screen.getByText('confirm')).toBeDisabled();

        fireEvent.click(screen.getByTitle('select_all'));
        expect(screen.getByText('confirm')).not.toBeDisabled();

        fireEvent.click(screen.getByText('confirm'));

        expect(dumpDataset).toHaveBeenCalledWith([
            'field1',
            'field2',
            'field3',
        ]);
    });

    it('should allow to remove target field with their remove button', () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        fireEvent.click(screen.getByText('export_raw_dataset'));

        fireEvent.click(
            screen.getByLabelText(
                'remove_field_from_export+{"field":"label 2"}',
            ),
        );

        fireEvent.click(screen.getByText('confirm'));

        expect(dumpDataset).toHaveBeenCalledWith(['field1', 'field3']);
    });
});
