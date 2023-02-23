import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import datasetApi from '../api/dataset';
import publishApi from '../api/publish';
import { ParsingDeleteRowDialog } from './ParsingDeleteRowDialog';
import '@testing-library/jest-dom';

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
            t: key => key,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the dialog when isOpen is true', () => {
        const { getByText } = render(
            <ParsingDeleteRowDialog
                isOpen={isOpen}
                handleClose={mockHandleClose}
                p={polyglot}
                selectedRowForDelete={selectedRowForDelete}
                reloadDataset={mockReloadDataset}
            />,
        );

        expect(getByText(/dataset.csv/)).toBeInTheDocument();
        expect(getByText('parsing_delete_row_description')).toBeInTheDocument();
        expect(getByText('cancel')).toBeInTheDocument();
        expect(getByText('delete')).toBeInTheDocument();
    });

    it('calls handleClose when close button is clicked', () => {
        const { getByText } = render(
            <ParsingDeleteRowDialog
                isOpen={isOpen}
                handleClose={mockHandleClose}
                p={polyglot}
                selectedRowForDelete={selectedRowForDelete}
                reloadDataset={mockReloadDataset}
            />,
        );

        act(() => {
            fireEvent.click(getByText('cancel'));
        });
        expect(mockHandleClose).toHaveBeenCalled();
    });

    it('calls deleteDatasetRow and reloadDataset when delete button is clicked', async () => {
        datasetApi.deleteDatasetRow.mockResolvedValue({ status: 'deleted' });

        const { getByText } = render(
            <ParsingDeleteRowDialog
                isOpen={isOpen}
                handleClose={mockHandleClose}
                p={polyglot}
                selectedRowForDelete={selectedRowForDelete}
                reloadDataset={mockReloadDataset}
            />,
        );

        await act(async () => {
            fireEvent.click(getByText('delete'));
        });

        expect(datasetApi.deleteDatasetRow).toHaveBeenCalledWith('1');
        expect(mockReloadDataset).toHaveBeenCalled();
    });

    it('should not call publish when shouldRepublish is false', async () => {
        datasetApi.deleteDatasetRow.mockResolvedValue({ status: 'deleted' });

        const { getByText } = render(
            <ParsingDeleteRowDialog
                isOpen={isOpen}
                handleClose={mockHandleClose}
                p={polyglot}
                selectedRowForDelete={selectedRowForDelete}
                reloadDataset={mockReloadDataset}
                shouldRepublish={false}
            />,
        );

        await act(async () => {
            fireEvent.click(getByText('delete'));
        });

        expect(publishApi.publish).not.toHaveBeenCalled();
    });

    it('should call publish when shouldRepublish is true', async () => {
        datasetApi.deleteDatasetRow.mockResolvedValue({ status: 'deleted' });

        const { getByText } = render(
            <ParsingDeleteRowDialog
                isOpen={isOpen}
                handleClose={mockHandleClose}
                p={polyglot}
                selectedRowForDelete={selectedRowForDelete}
                reloadDataset={mockReloadDataset}
                shouldRepublish={true}
            />,
        );

        await act(async () => {
            fireEvent.click(getByText('delete'));
        });

        expect(publishApi.publish).toHaveBeenCalled();
    });
});
