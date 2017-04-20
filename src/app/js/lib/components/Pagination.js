/*
Taken from https://raw.githubusercontent.com/ENDiGo/pagination-material-ui
Could not use it from npm at the time as it has not been compiled correctly
*/

/* eslint-disable */

import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import memoize from 'lodash.memoize';

import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

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
        display: 'flex',
        alignItems: 'center',
        height: 56,
        marginLeft: 0,
    },
    label: {
		display: 'inline-block',
        color: '#999',
        fontWeight: 300,
        fontSize: 12,
		marginRight: 16
    },
    input: {
		display: 'inline-block',
        width: 100,
        textAlign: 'right',
    },
    underline: {
        display: 'none'
    }
}

const texts = {
    page: 'Page: ',
    perPage: 'Per Page: ',
    showing: 'Showing {from} to {to} of {total}'
}

class Pagination extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        total: PropTypes.number.isRequired,
        currentPage: PropTypes.number.isRequired,
        perPage: PropTypes.number.isRequired,
        texts: PropTypes.shape({
            page: PropTypes.string.isRequired,
            perPage: PropTypes.string.isRequired,
            showing: PropTypes.string.isRequired,
        })
    };

    static defaultProps = {
        total: 0,
        perPage: 10,
        texts: texts
    };

    state = {
        pages: [],
    };

    componentDidMount() {
        this.calculatePageCount(this.props.total, this.props.perPage)
    }

    componentWillReceiveProps(nextProps) {
        this.calculatePageCount(nextProps.total, nextProps.perPage);
    }

    calculatePageCount = (total, perPage) => {
        const pages = [];
        const count = Math.ceil(total / perPage);

        for (var i = 0; i < count; i++) {
            pages.push(i);
        }

        this.setState({ pages, count });
    }

    handleChangePerPage = (e, idx, perPage) => {
		const count = Math.ceil(this.props.total / perPage);
		let currentPage = this.props.currentPage;

		if (count < this.state.count) {
			currentPage = count - 1;
		}
		
        this.props.onChange(currentPage, perPage);
    }

	handlePreviousPageClick = () => {
		this.handleChangePage(this.props.currentPage - 1);
	}

	handleNextPageClick = () => {
		this.handleChangePage(this.props.currentPage + 1);
	}

    handleChangePage = (currentPage) => {
        this.props.onChange(currentPage, this.props.perPage);
    }

	handleChangePageFromSelect = (e, idx, page) => {
		this.handleChangePage(page);
	}

	handleChangePageFromText = (e) => {
		const page = parseInt(e.target.value) - 1;

		if (page < this.state.count && page > -1) {
			this.handleChangePage(page);
		}
	}

    render() {
        const { perPage, currentPage, total, texts } = this.props;
        const { pages, count } = this.state;
		const pageToDisplay = currentPage + 1;

        let to = pageToDisplay * perPage,
            _from = to - perPage;

        if(to > total) {
            to = total;
		}

        let showing = texts.showing.replace('{total}', total)
            .replace('{from}', _from)
            .replace('{to}', to);

        return (
            <div style={styles.pagination}>
                <div style={styles.pageSelect}>
                    <div style={styles.label}>{`${texts.page} `}</div>
					{pages.length < 11 &&
						<SelectField 
							onChange={this.handleChangePageFromSelect}
							value={currentPage}
							style={styles.input}
							underlineStyle={styles.underline}>
							{
								pages.map(page => (
									<MenuItem 
										primaryText={page + 1}
										value={page} 
										key={`page-${page}`}/>
								))
							}
						</SelectField>
					}
					{pages.length > 10 &&
						<TextField
							name="page"
							onChange={this.handleChangePageFromText}
							style={styles.input}
							value={pageToDisplay}
							fullWidth
							type="number"
						/>
					}
                </div>
                <div style={styles.elements}>
                    <div style={styles.label}>{`${texts.perPage} `}</div>
                    <SelectField 
                        onChange={this.handleChangePerPage}
                        value={perPage}
                        style={styles.select} 
                        underlineStyle={styles.underline}>
                        <MenuItem value={10} primaryText="10"/>
                        <MenuItem value={15} primaryText="15"/>
                        <MenuItem value={20} primaryText="20"/>
                    </SelectField>
                </div>
                <div style={styles.elements}>
                    <div style={styles.label}>{`${showing}`}</div>
                    <IconButton 
                        disabled={currentPage === 0}
                        onTouchTap={this.handlePreviousPageClick}>
                        <ChevronLeft/>
                    </IconButton>
                    <IconButton 
                        disabled={currentPage === count - 1}
                        onTouchTap={this.handleNextPageClick}>
                        <ChevronRight/>
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default Pagination;
