/*
Taken from https://raw.githubusercontent.com/ENDiGo/pagination-material-ui
Could not use it from npm at the time as it has not been compiled correctly
*/

import { useState, useEffect } from 'react';
import { IconButton, MenuItem, Select, TextField } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

const styles = {
    container: {
        borderTop: '1px solid rgb(224, 224, 224)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    elements: {
        display: 'flex',
        alignItems: 'center',
        height: 56,
        marginLeft: 16,
    },
    label: {
        display: 'inline-block',
        color: '#999',
        fontWeight: 300,
        fontSize: 12,
        marginRight: 16,
    },
    input: {
        display: 'inline-block',
        width: '100%',
    },
};

const defaultTexts = {
    page: 'Page: ',
    perPage: 'Per Page: ',
    showing: 'Showing {from} to {to} of {total}',
};

interface PaginationProps {
    onChange(...args: unknown[]): unknown;
    total: number;
    currentPage: number;
    perPage: number;
    texts?: {
        page: string;
        perPage: string;
        showing: string;
    };
    column?: any;
}

const Pagination = ({
    total = 0,
    perPage = 10,
    texts = defaultTexts,
    column = null,
    currentPage,
    onChange,
}: PaginationProps) => {
    const [pages, setPages] = useState<number[]>([]);
    const [count, setCount] = useState<number>(0);

    // @ts-expect-error TS7006
    const calculatePageCount = (total, perPage) => {
        const newPages = [];
        const newCount = Math.ceil(total / perPage);

        for (let i = 0; i < newCount; i++) {
            newPages.push(i);
        }

        setPages(newPages);
        setCount(newCount);
    };

    useEffect(() => {
        calculatePageCount(total, perPage);
    }, [total, perPage]);

    // @ts-expect-error TS7006
    const handleChangePage = (newCurrentPage) => {
        onChange(newCurrentPage, perPage);
    };

    // @ts-expect-error TS7006
    const handleChangePerPage = (e) => {
        const newPerPage = e.target.value;
        const newCount = Math.ceil(total / newPerPage);
        let newCurrentPage = currentPage;

        if (newCount < count && currentPage !== 0) {
            newCurrentPage = newCount - 1;
        }

        onChange(newCurrentPage, newPerPage);
    };

    const handlePreviousPageClick = () => {
        handleChangePage(currentPage - 1);
    };

    const handleNextPageClick = () => {
        handleChangePage(currentPage + 1);
    };

    // @ts-expect-error TS7006
    const handleChangePageFromSelect = (e) => {
        handleChangePage(e.target.value);
    };

    // @ts-expect-error TS7006
    const handleChangePageFromText = (e) => {
        const page = parseInt(e.target.value) - 1;

        if (page < count && page > -1) {
            handleChangePage(page);
        }
    };

    const pageToDisplay = currentPage + 1;

    let to = pageToDisplay * perPage;
    const from = to - perPage + 1;

    if (to > total) {
        to = total;
    }

    const showing = texts.showing
        .replace('{total}', total.toString())
        .replace('{from}', from.toString())
        .replace('{to}', to.toString());

    const navigationArrow = (
        <div style={styles.elements}>
            <div style={styles.label}>{`${showing}`}</div>
            <IconButton
                disabled={currentPage === 0}
                onClick={handlePreviousPageClick}
            >
                <ChevronLeft />
            </IconButton>
            <IconButton
                disabled={currentPage === count - 1}
                onClick={handleNextPageClick}
            >
                <ChevronRight />
            </IconButton>
        </div>
    );

    if (column) {
        return <div style={styles.container}>{navigationArrow}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.elements}>
                <div style={styles.label}>{`${texts.page} `}</div>
                {pages.length < 11 && (
                    <Select
                        onChange={handleChangePageFromSelect}
                        value={currentPage}
                        sx={styles.input}
                        variant="standard"
                    >
                        {pages.map((page) => (
                            <MenuItem value={page} key={`page-${page}`}>
                                {page + 1}
                            </MenuItem>
                        ))}
                    </Select>
                )}
                {pages.length > 10 && (
                    <TextField
                        name="page"
                        onChange={handleChangePageFromText}
                        sx={styles.input}
                        value={pageToDisplay}
                        type="number"
                        variant="standard"
                    />
                )}
            </div>
            <div style={styles.elements}>
                <div style={styles.label}>{`${texts.perPage} `}</div>
                <Select
                    onChange={handleChangePerPage}
                    value={perPage}
                    sx={styles.input}
                    variant="standard"
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
            </div>
            {navigationArrow}
        </div>
    );
};

export default Pagination;
