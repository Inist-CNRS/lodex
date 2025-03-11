import React from 'react';
import {
    ExportDatasetButtonComponent,
    ExportDatasetButtonWithFetch,
} from './ExportDatasetButton';
import { fireEvent, render, screen, act } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import datasetApi from '../../admin/api/dataset';

jest.mock('../../admin/api/dataset', () => ({
    getDatasetColumns: jest.fn(),
}));

const TestExportDatasetButton = (props) => {
    return (
        <TestI18N>
            <ExportDatasetButtonComponent
                choices={['field1', 'field2', 'field3']}
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
        expect(screen.getByText('field1')).toBeInTheDocument();
        expect(screen.getByText('field2')).toBeInTheDocument();
        expect(screen.getByText('field3')).toBeInTheDocument();

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
        fireEvent.click(screen.getByRole('option', { name: 'field1' }));
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
        fireEvent.click(screen.getByRole('option', { name: 'field1' }));
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
                'remove_field_from_export+{"field":"field2"}',
            ),
        );

        fireEvent.click(screen.getByText('confirm'));

        expect(dumpDataset).toHaveBeenCalledWith(['field1', 'field3']);
    });

    describe('ExportDatasetButtonWithFetch', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('should fetch dataset columns and display them as choices except _id', async () => {
            datasetApi.getDatasetColumns.mockResolvedValue({
                columns: [
                    { key: '_id' },
                    { key: 'field1' },
                    { key: 'field2' },
                    { key: 'field3' },
                ],
            });
            const dumpDataset = jest.fn();
            const onDone = jest.fn();
            await act(async () => {
                render(
                    <TestI18N>
                        <ExportDatasetButtonWithFetch
                            dumpDataset={dumpDataset}
                            onDone={onDone}
                        />
                    </TestI18N>,
                );
            });

            expect(screen.getByText('export_raw_dataset')).toBeInTheDocument();
            expect(screen.getByText('export_raw_dataset')).not.toBeDisabled();
            fireEvent.click(screen.getByText('export_raw_dataset'));
            expect(
                screen.getByText('what_data_do_you_want_to_export'),
            ).toBeInTheDocument();

            expect(
                screen.getByText('export_choose_fields'),
            ).toBeInTheDocument();
            expect(screen.getByText('field1')).toBeInTheDocument();
            expect(screen.getByText('field2')).toBeInTheDocument();
            expect(screen.getByText('field3')).toBeInTheDocument();
            expect(screen.queryByText('_id')).not.toBeInTheDocument();

            fireEvent.click(screen.getByText('confirm'));

            expect(dumpDataset).toHaveBeenCalledWith([
                'field1',
                'field2',
                'field3',
            ]);
        });
    });
});
