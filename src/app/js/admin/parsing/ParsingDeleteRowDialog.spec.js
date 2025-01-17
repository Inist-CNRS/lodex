import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import datasetApi from '../api/dataset';
import publishApi from '../api/publish';
import { ParsingDeleteRowDialog } from './ParsingDeleteRowDialog';
import '@testing-library/jest-dom';
import { TestI18N } from '../../i18n/I18NContext';

jest.mock('../api/dataset');
jest.mock('../api/publish', () => ({
    publish: jest.fn(),
}));

describe('ParsingDeleteRowDialog component', () => {
    let mockReloadDataset,
        mockHandleClose,
        isOpen,
        selectedRowForDelete,
        polyglot;

    beforeEach(() => {
        mockReloadDataset = jest.fn();
        mockHandleClose = jest.fn();
        isOpen = true;
        selectedRowForDelete = { _id: '1', uri: 'dataset.csv' };
        polyglot = {
            t: (key) => key,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the dialog when isOpen is true', () => {
        const { getByText } = render(
            <TestI18N>
                <ParsingDeleteRowDialog
                    isOpen={isOpen}
                    handleClose={mockHandleClose}
                    p={polyglot}
                    selectedRowForDelete={selectedRowForDelete}
                    reloadDataset={mockReloadDataset}
                />
            </TestI18N>,
        );

        expect(getByText(/dataset.csv/)).toBeInTheDocument();
        expect(getByText('parsing_delete_row_description')).toBeInTheDocument();
        expect(getByText('cancel')).toBeInTheDocument();
        expect(getByText('confirm')).toBeInTheDocument();
    });

    it('calls handleClose when close button is clicked', () => {
        const { getByText } = render(
            <TestI18N>
                <ParsingDeleteRowDialog
                    isOpen={isOpen}
                    handleClose={mockHandleClose}
                    p={polyglot}
                    selectedRowForDelete={selectedRowForDelete}
                    reloadDataset={mockReloadDataset}
                />
            </TestI18N>,
        );

        act(() => {
            fireEvent.click(getByText('cancel'));
        });
        expect(mockHandleClose).toHaveBeenCalled();
    });

    it('calls deleteDatasetRow and reloadDataset when confirm button is clicked', async () => {
        datasetApi.deleteDatasetRow.mockResolvedValue({ status: 'deleted' });

        const { getByText } = render(
            <TestI18N>
                <ParsingDeleteRowDialog
                    isOpen={isOpen}
                    handleClose={mockHandleClose}
                    p={polyglot}
                    selectedRowForDelete={selectedRowForDelete}
                    reloadDataset={mockReloadDataset}
                />
            </TestI18N>,
        );

        await act(async () => {
            fireEvent.click(getByText('confirm'));
        });

        expect(datasetApi.deleteDatasetRow).toHaveBeenCalledWith('1');
        expect(mockReloadDataset).toHaveBeenCalled();
    });

    it('should not call publish when shouldRepublish is false', async () => {
        datasetApi.deleteDatasetRow.mockResolvedValue({ status: 'deleted' });

        const { getByText } = render(
            <TestI18N>
                <ParsingDeleteRowDialog
                    isOpen={isOpen}
                    handleClose={mockHandleClose}
                    p={polyglot}
                    selectedRowForDelete={selectedRowForDelete}
                    reloadDataset={mockReloadDataset}
                    shouldRepublish={false}
                />
            </TestI18N>,
        );

        await act(async () => {
            fireEvent.click(getByText('confirm'));
        });

        expect(publishApi.publish).not.toHaveBeenCalled();
    });

    it('should call publish when shouldRepublish is true', async () => {
        datasetApi.deleteDatasetRow.mockResolvedValue({ status: 'deleted' });

        const { getByText } = render(
            <TestI18N>
                <ParsingDeleteRowDialog
                    isOpen={isOpen}
                    handleClose={mockHandleClose}
                    p={polyglot}
                    selectedRowForDelete={selectedRowForDelete}
                    reloadDataset={mockReloadDataset}
                    shouldRepublish={true}
                />
            </TestI18N>,
        );

        await act(async () => {
            fireEvent.click(getByText('confirm'));
        });

        expect(publishApi.publish).toHaveBeenCalled();
    });
});
