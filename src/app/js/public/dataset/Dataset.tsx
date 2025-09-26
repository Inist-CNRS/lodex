import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';
import { grey } from '@mui/material/colors';

import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@mui/material';

import DatasetColumn from './DatasetColumn';
import DatasetColumnHeader from './DatasetColumnHeader';
import Pagination from '../../lib/components/Pagination';
import Loading from '../../lib/components/Loading';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { preLoadDatasetPage, changePage } from './';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';

const styles = {
    table: {
        display: 'block',
        overflowX: 'auto',
        width: 'auto',
    },
    wrapper: {
        maxWidth: '100%',
    },
    noResult: {
        textAlign: 'center',
    },
    propertiesContainer: {
        paddingTop: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    },
    label: {
        color: grey[500],
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: '1rem',
        textDecoration: 'none',
    },
    labelContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
};

export class DatasetComponent extends Component {
    UNSAFE_componentWillMount() {
        // @ts-expect-error TS2339
        const { currentPage, perPage } = this.props;
        // @ts-expect-error TS2339
        this.props.preLoadDatasetPage({ page: currentPage, perPage });
    }

    // @ts-expect-error TS7006
    handlePageChange = (page, perPage) => {
        // @ts-expect-error TS2339
        this.props.changePage({ page, perPage });
    };

    render() {
        const {
            // @ts-expect-error TS2339
            columns,
            // @ts-expect-error TS2339
            dataset,
            // @ts-expect-error TS2339
            loading,
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            total,
            // @ts-expect-error TS2339
            perPage,
            // @ts-expect-error TS2339
            currentPage,
        } = this.props;
        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;
        return (
            <div className="dataset" style={styles.wrapper}>
                <div className="dataset" style={styles.wrapper}>
                    <div style={styles.propertiesContainer}>
                        <div style={styles.labelContainer}>
                            <span
                                className="property_label resources"
                                style={styles.label}
                            >
                                {polyglot.t('resources')}
                            </span>
                        </div>
                    </div>
                </div>
                <Table sx={styles.table}>
                    <TableHead>
                        <TableRow>
                            {/*
                             // @ts-expect-error TS7006 */}
                            {columns.map((c) => (
                                // @ts-expect-error TS2741
                                <DatasetColumnHeader
                                    key={c.name}
                                    name={c.name}
                                    label={c.label}
                                />
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!dataset.length ? (
                            <TableRow>
                                <TableCell>{polyglot.t('no_result')}</TableCell>
                            </TableRow>
                        ) : (
                            // @ts-expect-error TS7006
                            dataset.map((data, indice) => (
                                <TableRow key={data.uri}>
                                    {/*
                                     // @ts-expect-error TS7006 */}
                                    {columns.map((column) => (
                                        <DatasetColumn
                                            key={column.name}
                                            column={column}
                                            columns={columns}
                                            resource={data}
                                            indice={
                                                indice +
                                                1 +
                                                perPage * currentPage
                                            }
                                        />
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
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

// @ts-expect-error TS2339
DatasetComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    dataset: PropTypes.arrayOf(PropTypes.object),
    preLoadDatasetPage: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    total: PropTypes.number.isRequired,
};

// @ts-expect-error TS2339
DatasetComponent.defaultProps = {
    columns: [],
    dataset: [],
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    loading: fromDataset.isDatasetLoading(state),
    // @ts-expect-error TS2339
    columns: fromFields.getListFields(state),
    // @ts-expect-error TS2339
    currentPage: fromDataset.getDatasetCurrentPage(state),
    // @ts-expect-error TS2339
    perPage: fromDataset.getDatasetPerPage(state),
    // @ts-expect-error TS2339
    dataset: fromDataset.getDataset(state),
    // @ts-expect-error TS2339
    total: fromDataset.getDatasetTotal(state),
});

const mapDispatchToProps = {
    preLoadDatasetPage,
    changePage,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetComponent);
