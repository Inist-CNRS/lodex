/* eslint react/prop-types: 0 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Card, CardHeader, Avatar } from 'material-ui';

import { grey50 } from 'material-ui/styles/colors';

import Pagination from '../../lib/components/Pagination';
import Loading from '../../lib/components/Loading';
import { loadDatasetPage as loadDatasetPageAction } from '../dataset';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';
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
        const { loadDatasetPage, currentPage, perPage } = this.props;
        loadDatasetPage({ page: currentPage, perPage });
    }

    handlePageChange = (page, perPage) => {
        this.props.loadDatasetPage({ page, perPage });
    }

    render() {
        const { loading, p: polyglot, dataset, columns, total, perPage, currentPage } = this.props;

        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;
        return (
            <div className="overview" style={styles.wrapper}>
                <div
                    style={styles.container}
                >
                    { dataset.map((data, index) => (
                        <Card
                            style={styles.item}
                            // eslint-disable-next-line
                            key={`overview-${index}`}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        icon={<img alt="lodex_logo" src="/lodex.png" />}
                                        backgroundColor={grey50}
                                        size={60}
                                    />
                                }
                                title={
                                    <a
                                        href={`/${data.uri}`}
                                        title={
                                        (columns.filter(e => e.overview === 1).length) ?
                                        data[columns.filter(e => e.overview === 1)[0].name] :
                                        data.uri}
                                    >
                                        {
                                    (columns.filter(e => e.overview === 1).length) ?
                                        data[columns.filter(e => e.overview === 1)[0].name] :
                                        data.uri
                                    }</a>}
                                subtitle={
                                    (columns.filter(e => e.overview === 2).length) ?
                                        data[columns.filter(e => e.overview === 2)[0].name] :
                                        ''
                                    }
                                titleStyle={styles.title}
                                subtitleStyle={styles.title}
                            />
                        </Card>
                )) }
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
    columns: PropTypes.arrayOf(PropTypes.object),
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    dataset: PropTypes.arrayOf(PropTypes.object),
    loadDatasetPage: PropTypes.func.isRequired,
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
    columns: fromFields.getAllListFields(state),
    currentPage: fromDataset.getDatasetCurrentPage(state),
    perPage: fromDataset.getDatasetPerPage(state),
    dataset: fromDataset.getDataset(state),
    total: fromDataset.getDatasetTotal(state),
});
const mapDispatchToProps = ({
    loadDatasetPage: loadDatasetPageAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(OverviewComponent);
