/*
Taken from https://raw.githubusercontent.com/ENDiGo/pagination-material-ui
Could not use it from npm at the time as it has not been compiled correctly
*/

// @ts-expect-error TS6133
import React, { Component } from 'react';
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

const texts = {
    page: 'Page: ',
    perPage: 'Per Page: ',
    showing: 'Showing {from} to {to} of {total}',
};

interface PaginationProps {
    onChange(...args: unknown[]): unknown;
    total: number;
    currentPage: number;
    perPage: number;
    texts: {
        page: string;
        perPage: string;
        showing: string;
    };
    column?: any;
}

class Pagination extends Component<PaginationProps> {
    static defaultProps = {
        total: 0,
        perPage: 10,
        texts: texts,
        column: null,
    };

    state = {
        pages: [],
    };

    componentDidMount() {
        this.calculatePageCount(this.props.total, this.props.perPage);
    }

    // @ts-expect-error TS7006
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.calculatePageCount(nextProps.total, nextProps.perPage);
    }

    // @ts-expect-error TS7006
    calculatePageCount = (total, perPage) => {
        const pages = [];
        const count = Math.ceil(total / perPage);

        for (let i = 0; i < count; i++) {
            pages.push(i);
        }

        this.setState({ pages, count });
    };

    // @ts-expect-error TS7006
    handleChangePerPage = (e) => {
        const perPage = e.target.value;
        const count = Math.ceil(this.props.total / perPage);
        let currentPage = this.props.currentPage;

        // @ts-expect-error TS2339
        if (count < this.state.count && currentPage !== 0) {
            currentPage = count - 1;
        }

        this.props.onChange(currentPage, perPage);
    };

    handlePreviousPageClick = () => {
        this.handleChangePage(this.props.currentPage - 1);
    };

    handleNextPageClick = () => {
        this.handleChangePage(this.props.currentPage + 1);
    };

    // @ts-expect-error TS7006
    handleChangePage = (currentPage) => {
        this.props.onChange(currentPage, this.props.perPage);
    };

    // @ts-expect-error TS7006
    handleChangePageFromSelect = (e) => {
        this.handleChangePage(e.target.value);
    };

    // @ts-expect-error TS7006
    handleChangePageFromText = (e) => {
        const page = parseInt(e.target.value) - 1;

        // @ts-expect-error TS2339
        if (page < this.state.count && page > -1) {
            this.handleChangePage(page);
        }
    };

    render() {
        const { perPage, currentPage, total, texts, column } = this.props;
        // @ts-expect-error TS2339
        const { pages, count } = this.state;
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
                    onClick={this.handlePreviousPageClick}
                >
                    <ChevronLeft />
                </IconButton>
                <IconButton
                    disabled={currentPage === count - 1}
                    onClick={this.handleNextPageClick}
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
                            onChange={this.handleChangePageFromSelect}
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
                            onChange={this.handleChangePageFromText}
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
                        onChange={this.handleChangePerPage}
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
    }
}

export default Pagination;
