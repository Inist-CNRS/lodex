/*
Taken from https://raw.githubusercontent.com/ENDiGo/pagination-material-ui
Could not use it from npm at the time as it has not been compiled correctly
*/

/* eslint-disable */

import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

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
		perPage: PropTypes.number,
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
		currentPage: 1,
		perPage: 10,
		count: 0,
		pages: [],
	};

	constructor(props) {
		super(props);

		this.handleChangePerPage = this.handleChangePerPage.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
	}

	componentDidMount() {
		this.calculatePageCount(this.props.total)
	}

	componentWillReceiveProps(nextProps) {
		this.calculatePageCount(nextProps.total)
	}

	calculatePageCount(total) {
		let {perPage} = this.state,
			pages = [],
			count = Math.ceil(total/perPage);

		for (var i = 1; i <= count; i++) {
			pages.push(i);
		}

		this.setState({pages, count});
	}

	handleChangePerPage(perPage) {
		let currentPage = 1;
		this.setState({perPage, currentPage});
		this.calculatePageCount(this.props.total);

		this.onChange(currentPage, perPage);
	}

	handleChangePage(currentPage) {
		let { perPage, count } = this.state;

		if(currentPage < 0)
			currentPage = 0;
		if(currentPage > count)
			currentPage = count;

		this.setState({currentPage})
		this.onChange(currentPage, perPage);
	}

	onChange(currentPage, perPage) {
		this.props.onChange(currentPage, perPage);
	}

	render() {
		let { total, texts } = this.props,
			{ perPage, currentPage, pages, count } = this.state;


		let to = currentPage * perPage,
			_from = to - perPage;

		if(to > total)
			to = total;

		let showing = texts.showing.replace('{total}', total)
			.replace('{from}', _from)
			.replace('{to}', to);

		return (
			<div style={styles.pagination}>
				<div style={Object.assign({}, styles.elements, styles.pageSelect)}>
					<div style={styles.label}>{`${texts.page} `}</div>
					<SelectField 
						onChange={(e, idx, page) => this.handleChangePage(page)}
						value={currentPage}
						style={styles.select} 
						underlineStyle={styles.underline}>
						{
							pages.map(page => (
								<MenuItem 
									primaryText={page}
									value={page} 
									key={`page-${page}`}/>
							))
						}
					</SelectField>
				</div>
				<div style={styles.elements}>
					<div style={styles.label}>{`${texts.perPage} `}</div>
					<SelectField 
						onChange={(e, idx, perPage) => this.handleChangePerPage(perPage)}
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
						disabled={currentPage === 1}
						onTouchTap={e => this.handleChangePage(currentPage - 1)}>
						<ChevronLeft/>
					</IconButton>
					<IconButton 
						disabled={currentPage === count}
						onTouchTap={e => this.handleChangePage(currentPage + 1)}>
						<ChevronRight/>
					</IconButton>
				</div>
			</div>
		)
	}
}

export default Pagination;
