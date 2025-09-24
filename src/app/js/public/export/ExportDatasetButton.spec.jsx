import React from 'react';
import { fireEvent, render, waitFor } from '../../../../test-utils';
import datasetApi from '../../admin/api/dataset';
import { TestI18N } from '../../i18n/I18NContext';
import {
    ExportDatasetButtonComponent,
    ExportDatasetButtonWithFetch,
} from './ExportDatasetButton';

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
    it('should render a export button, opening a model with all fields preselected, confirming call dumpDataset with them', async () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        const wrapper = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        expect(wrapper.getByText('export_raw_dataset')).toBeInTheDocument();
        expect(wrapper.getByText('export_raw_dataset')).not.toBeDisabled();
        await waitFor(() => {
            fireEvent.click(wrapper.getByText('export_raw_dataset'));
        });

        expect(
            wrapper.getByText('what_data_do_you_want_to_export'),
        ).toBeInTheDocument();

        expect(
            wrapper.getByLabelText('export_choose_fields'),
        ).toBeInTheDocument();
        expect(wrapper.getByText('field1')).toBeInTheDocument();
        expect(wrapper.getByText('field2')).toBeInTheDocument();
        expect(wrapper.getByText('field3')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('confirm'));
        });

        expect(dumpDataset).toHaveBeenCalledWith([
            'field1',
            'field2',
            'field3',
        ]);
    });

    it('should allow to unselect some field before export', async () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        const wrapper = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('export_raw_dataset'));
        });

        await waitFor(() => {
            fireEvent.mouseDown(wrapper.getByLabelText('export_choose_fields'));
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByRole('option', { name: 'field1' }));
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('confirm'));
        });

        expect(dumpDataset).toHaveBeenCalledWith(['field2', 'field3']);
    });

    it('should allow to unselect all field with the clear_all button, this disable the confirm button, until at least one is selected', async () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        const wrapper = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('export_raw_dataset'));
        });
        expect(wrapper.getByText('confirm')).not.toBeDisabled();

        await waitFor(() => {
            fireEvent.click(wrapper.getByTitle('clear_all'));
        });
        expect(wrapper.getByText('confirm')).toBeDisabled();

        await waitFor(() => {
            fireEvent.mouseDown(wrapper.getByLabelText('export_choose_fields'));
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByRole('option', { name: 'field1' }));
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('confirm'));
        });

        expect(dumpDataset).toHaveBeenCalledWith(['field1']);
    });

    it('should allow to readd all field with the select_all button', async () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        const wrapper = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('export_raw_dataset'));
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByTitle('clear_all'));
        });

        expect(wrapper.getByText('confirm')).toBeDisabled();

        await waitFor(() => {
            fireEvent.click(wrapper.getByTitle('select_all'));
        });
        expect(wrapper.getByText('confirm')).not.toBeDisabled();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('confirm'));
        });

        expect(dumpDataset).toHaveBeenCalledWith([
            'field1',
            'field2',
            'field3',
        ]);
    });

    it('should allow to remove target field with their remove button', async () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        const wrapper = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('export_raw_dataset'));
        });

        await waitFor(() => {
            fireEvent.click(
                wrapper.getByLabelText(
                    'remove_field_from_export+{"field":"field2"}',
                ),
            );
        });

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('confirm'));
        });

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
            const wrapper = await waitFor(() => {
                return render(
                    <TestI18N>
                        <ExportDatasetButtonWithFetch
                            dumpDataset={dumpDataset}
                            onDone={onDone}
                        />
                    </TestI18N>,
                );
            });

            expect(wrapper.getByText('export_raw_dataset')).toBeInTheDocument();
            expect(wrapper.getByText('export_raw_dataset')).not.toBeDisabled();

            await waitFor(() => {
                fireEvent.click(wrapper.getByText('export_raw_dataset'));
            });
            expect(
                wrapper.getByText('what_data_do_you_want_to_export'),
            ).toBeInTheDocument();

            expect(
                wrapper.getByLabelText('export_choose_fields'),
            ).toBeInTheDocument();
            expect(wrapper.getByText('field1')).toBeInTheDocument();
            expect(wrapper.getByText('field2')).toBeInTheDocument();
            expect(wrapper.getByText('field3')).toBeInTheDocument();
            expect(wrapper.queryByText('_id')).not.toBeInTheDocument();

            await waitFor(() => {
                fireEvent.click(wrapper.getByText('confirm'));
            });

            expect(dumpDataset).toHaveBeenCalledWith([
                'field1',
                'field2',
                'field3',
            ]);
        });
    });
});
