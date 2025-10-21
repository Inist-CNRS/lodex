import { act, render } from '../../../../test-utils';
import datasetApi from '../../admin/api/dataset';
import { TestI18N } from '../../i18n/I18NContext';
import {
    ExportDatasetButtonComponent,
    ExportDatasetButtonWithFetch,
} from './ExportDatasetButton';

jest.mock('../../admin/api/dataset', () => ({
    getDatasetColumns: jest.fn(),
}));

// @ts-expect-error TS7006
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
        const screen = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        expect(screen.getByText('export_raw_dataset')).toBeInTheDocument();
        expect(screen.getByText('export_raw_dataset')).not.toBeDisabled();
        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('export_raw_dataset'));
        });

        expect(
            screen.getByText('what_data_do_you_want_to_export'),
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText('export_choose_fields'),
        ).toBeInTheDocument();
        expect(screen.getByText('field1')).toBeInTheDocument();
        expect(screen.getByText('field2')).toBeInTheDocument();
        expect(screen.getByText('field3')).toBeInTheDocument();

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('confirm'));
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
        const screen = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('export_raw_dataset'));
        });

        await screen.waitFor(() => {
            screen.fireEvent.mouseDown(
                screen.getByLabelText('export_choose_fields'),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('option', { name: 'field1' }),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('confirm'));
        });

        expect(dumpDataset).toHaveBeenCalledWith(['field2', 'field3']);
    });

    it('should allow to unselect all field with the clear_all button, this disable the confirm button, until at least one is selected', async () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        const screen = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('export_raw_dataset'));
        });
        expect(screen.getByText('confirm')).not.toBeDisabled();

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByTitle('clear_all'));
        });
        expect(screen.getByText('confirm')).toBeDisabled();

        await screen.waitFor(() => {
            screen.fireEvent.mouseDown(
                screen.getByLabelText('export_choose_fields'),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('option', { name: 'field1' }),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('confirm'));
        });

        expect(dumpDataset).toHaveBeenCalledWith(['field1']);
    });

    it('should allow to readd all field with the select_all button', async () => {
        const dumpDataset = jest.fn();
        const onDone = jest.fn();
        const screen = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('export_raw_dataset'));
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByTitle('clear_all'));
        });

        expect(screen.getByText('confirm')).toBeDisabled();

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByTitle('select_all'));
        });
        expect(screen.getByText('confirm')).not.toBeDisabled();

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('confirm'));
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
        const screen = render(
            <TestExportDatasetButton
                dumpDataset={dumpDataset}
                onDone={onDone}
            />,
        );

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('export_raw_dataset'));
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByLabelText(
                    'remove_field_from_export+{"field":"field2"}',
                ),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(screen.getByText('confirm'));
        });

        expect(dumpDataset).toHaveBeenCalledWith(['field1', 'field3']);
    });

    describe('ExportDatasetButtonWithFetch', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('should fetch dataset columns and display them as choices except _id', async () => {
            // @ts-expect-error TS2339
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
            const screen = await act(() => {
                return render(
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

            await screen.waitFor(() => {
                screen.fireEvent.click(screen.getByText('export_raw_dataset'));
            });
            expect(
                screen.getByText('what_data_do_you_want_to_export'),
            ).toBeInTheDocument();

            expect(
                screen.getByLabelText('export_choose_fields'),
            ).toBeInTheDocument();
            expect(screen.getByText('field1')).toBeInTheDocument();
            expect(screen.getByText('field2')).toBeInTheDocument();
            expect(screen.getByText('field3')).toBeInTheDocument();
            expect(screen.queryByText('_id')).not.toBeInTheDocument();

            await screen.waitFor(() => {
                screen.fireEvent.click(screen.getByText('confirm'));
            });

            expect(dumpDataset).toHaveBeenCalledWith([
                'field1',
                'field2',
                'field3',
            ]);
        });
    });
});
