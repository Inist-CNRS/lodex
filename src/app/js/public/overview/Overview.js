/* eslint react/prop-types: 0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Card, CardHeader, Avatar } from 'material-ui';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { grey50 } from 'material-ui/styles/colors';

import Pagination from '../../lib/components/Pagination';
import Loading from '../../lib/components/Loading';
import { preLoadDatasetPage, changePage } from '../dataset';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { getResourceUri } from '../../../../common/uris';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    wrapper: {
        maxWidth: '100%',
    },
    container: {
        display: 'flex',
        flexFlow: 'row wrap',
        margin: '0 auto',
    },
    item: {
        width: '350px',
        height: '100px',
        margin: '5px',
    },
    title: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '255px',
    },
};

export class OverviewComponent extends Component {
    componentWillMount() {
        const { currentPage, perPage } = this.props;
        this.props.preLoadDatasetPage({ page: currentPage, perPage });
    }

    handlePageChange = (page, perPage) => {
        this.props.changePage({ page, perPage });
    };

    render() {
        const {
            loading,
            p: polyglot,
            dataset,
            titleCol,
            subTitleCol,
            total,
            perPage,
            currentPage,
        } = this.props;

        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;
        return (
            <div className="overview" style={styles.wrapper}>
                <div style={styles.container}>
                    {dataset.map((data, index) => (
                        <Card
                            style={styles.item}
                            // eslint-disable-next-line react/no-array-index-key
                            key={`overview-${index}`}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        icon={
                                            <img
                                                alt="lodex_logo"
                                                src="/lodex.png"
                                            />
                                        }
                                        backgroundColor={grey50}
                                        size={60}
                                    />
                                }
                                title={
                                    <Link to={getResourceUri(data)}>
                                        {data[titleCol] || data.uri}
                                    </Link>
                                }
                                subtitle={data[subTitleCol] || ''}
                                titleStyle={styles.title}
                                subtitleStyle={styles.title}
                            />
                        </Card>
                    ))}
                </div>
                <Pagination
                    onChange={this.handlePageChange}
                    total={total}
                    perPage={perPage}
                    currentPage={currentPage}
                    texts={{
                        page: polyglot.t('page'),
                        perPage: polyglot.t('perPage'),
                        showing: polyglot.t('showing'),
                    }}
                />
            </div>
        );
    }
}

OverviewComponent.PropTypes = {
    subTitleCol: PropTypes.string,
    titleCol: PropTypes.string,
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    dataset: PropTypes.arrayOf(PropTypes.object),
    preLoadDatasetPage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    total: PropTypes.number.isRequired,
};

OverviewComponent.defaultProps = {
    columns: [],
    dataset: [],
};

const mapStateToProps = state => ({
    loading: fromDataset.isDatasetLoading(state),
    titleCol: fromFields.getOverviewTitleCol(state),
    subTitleCol: fromFields.getOverviewSubTitleCol(state),
    currentPage: fromDataset.getDatasetCurrentPage(state),
    perPage: fromDataset.getDatasetPerPage(state),
    dataset: fromDataset.getDataset(state),
    total: fromDataset.getDatasetTotal(state),
});
const mapDispatchToProps = {
    preLoadDatasetPage,
    changePage,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    OverviewComponent,
);
