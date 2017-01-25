// Taken from https://github.com/ENDiGo/pagination-material-ui

import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';

const styles = {
    pagination: {
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
    pageSelect: {
        marginLeft: 0,
    },
    label: {
        color: '#999',
        fontWeight: 300,
        fontSize: 12,
    },
    select: {
        width: 100,
        textAlign: 'right',
    },
    underline: {
        display: 'none',
    },
};

class Pagination extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes,
        perPage: PropTypes.number,
        total: PropTypes.number.isRequired,
    };

    static defaultProps = {
        total: 0,
        perPage: 10,
    };

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            perPage: props.perPage,
            count: 0,
            pages: [],
        };
    }

    componentDidMount() {
        this.calculatePageCount(this.props.total);
    }

    componentWillReceiveProps(nextProps) {
        this.calculatePageCount(nextProps.total);
    }

    onChange(currentPage, perPage) {
        this.props.onChange(currentPage, perPage);
    }

    calculatePageCount(total) {
        const { perPage } = this.state;
        const pages = [];
        const count = Math.ceil(total / perPage);

        for (let i = 1; i <= count; i += 1) {
            pages.push(i);
        }

        this.setState({ pages, count });
    }

    handleChangePerPage = (perPage) => {
        const currentPage = 1;
        this.setState({ perPage, currentPage });
        this.calculatePageCount(this.props.total);

        this.onChange(currentPage, perPage);
    }

    handleChangePage = (currentPage) => {
        const { perPage, count } = this.state;
        let finalCurrentPage = currentPage;

        if (finalCurrentPage < 0) finalCurrentPage = 0;

        if (finalCurrentPage > count) finalCurrentPage = count;

        this.setState({ currentPage: finalCurrentPage });
        this.onChange(currentPage, perPage);
    }

    render() {
        let { p: polyglot, total, texts } = this.props;
        const { perPage, currentPage, pages, count } = this.state;


        let to = currentPage * perPage;
        const from = to - perPage;

        if (to > total) {
            to = total;
        }

        const showing = polyglot.t('showing').replace('{total}', total)
            .replace('{from}', from)
            .replace('{to}', to);

        return (
            <div style={styles.pagination}>
                <div style={Object.assign({}, styles.elements, styles.pageSelect)}>
                    <div style={styles.label}>{polyglot.t('page')}</div>
                    <SelectField
                        onChange={(e, idx, page) => this.handleChangePage(page)}
                        value={currentPage}
                        style={styles.select}
                        underlineStyle={styles.underline}
                    >
                        {
                            pages.map(page => (
                                <MenuItem
                                    primaryText={page}
                                    value={page}
                                    key={`page-${page}`}
                                />
                            ))
                        }
                    </SelectField>
                </div>
                <div style={styles.elements}>
                    <div style={styles.label}>{polyglot.t('perPage')}</div>
                    <SelectField
                        onChange={(e, idx, newPerPage) => this.handleChangePerPage(newPerPage)}
                        value={perPage}
                        style={styles.select}
                        underlineStyle={styles.underline}
                    >
                        <MenuItem value={10} primaryText="10" />
                        <MenuItem value={15} primaryText="15" />
                        <MenuItem value={20} primaryText="20" />
                    </SelectField>
                </div>
                <div style={styles.elements}>
                    <div style={styles.label}>{showing}</div>
                    <IconButton
                        disabled={currentPage === 1}
                        onTouchTap={() => this.handleChangePage(currentPage - 1)}
                    >
                        <ChevronLeft />
                    </IconButton>
                    <IconButton
                        disabled={currentPage === count}
                        onTouchTap={() => this.handleChangePage(currentPage + 1)}
                    >
                        <ChevronRight />
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default translate(Pagination);
