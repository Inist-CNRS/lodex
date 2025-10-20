import { useEffect } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
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
import { preLoadDatasetPage, changePage } from './';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { useTranslate } from '../../i18n/I18NContext';

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

interface DatasetComponentProps {
    columns?: {
        name: string;
        label: string;
    }[];
    currentPage: number;
    perPage: number;
    dataset?: any[];
    preLoadDatasetPage(...args: unknown[]): unknown;
    changePage(...args: unknown[]): unknown;
    loading: boolean;
    total: number;
}

export const DatasetComponent = ({
    columns = [],
    currentPage,
    perPage,
    dataset = [],
    preLoadDatasetPage,
    changePage,
    loading,
    total,
}: DatasetComponentProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        preLoadDatasetPage({ page: currentPage, perPage });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array for componentDidMount behavior

    // @ts-expect-error TS7006
    const handlePageChange = (page, perPage) => {
        changePage({ page, perPage });
    };

    if (loading) return <Loading>{translate('loading')}</Loading>;

    return (
        <div className="dataset" style={styles.wrapper}>
            <div className="dataset" style={styles.wrapper}>
                <div style={styles.propertiesContainer}>
                    <div style={styles.labelContainer}>
                        <span
                            className="property_label resources"
                            style={styles.label}
                        >
                            {translate('resources')}
                        </span>
                    </div>
                </div>
            </div>
            <Table sx={styles.table}>
                <TableHead>
                    <TableRow>
                        {columns.map((c) => (
                            // @ts-expect-error TS2741
                            <DatasetColumnHeader
                                // @ts-expect-error TS2322
                                key={c.name}
                                // @ts-expect-error TS2322
                                name={c.name}
                                // @ts-expect-error TS2322
                                label={c.label}
                            />
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!dataset.length ? (
                        <TableRow>
                            <TableCell>{translate('no_result')}</TableCell>
                        </TableRow>
                    ) : (
                        dataset.map((data, indice) => (
                            <TableRow key={data.uri}>
                                {columns.map((column) => (
                                    <DatasetColumn
                                        key={column.name}
                                        // @ts-expect-error TS2322
                                        column={column}
                                        columns={columns}
                                        resource={data}
                                        indice={
                                            indice + 1 + perPage * currentPage
                                        }
                                    />
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Pagination
                onChange={handlePageChange}
                total={total}
                perPage={perPage}
                currentPage={currentPage}
                texts={{
                    page: translate('page'),
                    perPage: translate('perPage'),
                    showing: translate('showing'),
                }}
            />
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    loading: fromDataset.isDatasetLoading(state),
    columns: fromFields.getListFields(state),
    currentPage: fromDataset.getDatasetCurrentPage(state),
    perPage: fromDataset.getDatasetPerPage(state),
    dataset: fromDataset.getDataset(state),
    total: fromDataset.getDatasetTotal(state),
});

const mapDispatchToProps = {
    preLoadDatasetPage,
    changePage,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(DatasetComponent);
