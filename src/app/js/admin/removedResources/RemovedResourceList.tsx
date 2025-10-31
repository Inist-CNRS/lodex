import { useEffect } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import moment from 'moment';

import {
    CardContent,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
} from '@mui/material';

import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import Loading from '../../lib/components/Loading';
import Pagination from '../../lib/components/Pagination';
import {
    loadRemovedResourcePage as loadRemovedResourcePageAction,
    restoreRessource as restoreRessourceAction,
} from './';

import { fromRemovedResources } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { useTranslate } from '../../i18n/I18NContext';

const styles = {
    table: {
        width: 'auto',
        minWidth: '100%',
        overflowX: 'auto',
        display: 'block',
    },
};

interface RemovedResourceListComponentProps {
    columns: {
        name: string;
    }[];
    currentPage: number;
    resources: {
        uri: string;
        removedAt: string;
        reason: string;
        [key: string]: unknown;
    }[];
    loading: boolean;
    loadRemovedResourcePage(...args: unknown[]): unknown;
    restoreRessource(...args: unknown[]): unknown;
    total: number;
}

export const RemovedResourceListComponent = ({
    columns,
    currentPage,
    resources,
    loading,
    loadRemovedResourcePage,
    restoreRessource,
    total,
}: RemovedResourceListComponentProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        loadRemovedResourcePage({ page: currentPage, perPage: 10 });
    }, [loadRemovedResourcePage, currentPage]);

    // @ts-expect-error TS7006
    const handlePageChange = (currentPage, perPage) => {
        loadRemovedResourcePage({ page: currentPage, perPage });
    };

    // @ts-expect-error TS7006
    const handleRestoreResourceClick = (id) => () => {
        restoreRessource(id);
    };

    if (loading) return <Loading>{translate('loading')}</Loading>;

    return (
        <CardContent className="hidden_resources">
            <Table sx={styles.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>{translate('removed_at')}</TableCell>
                        <TableCell>{translate('removed_reason')}</TableCell>
                        <TableCell />
                        {/*
                             // @ts-expect-error TS7031 */}
                        {columns.map(({ name, label }) => (
                            <TableCell key={name}>{label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {resources.map((data) => (
                        <TableRow key={data.uri}>
                            <TableCell>
                                {moment(data.removedAt).format('L')}
                            </TableCell>
                            <TableCell>{data.reason}</TableCell>
                            <TableCell>
                                <ButtonWithStatus
                                    raised
                                    className="btn-restore-resource"
                                    loading={loading}
                                    onClick={handleRestoreResourceClick(
                                        data.uri,
                                    )}
                                    color="primary"
                                    data={data.uri}
                                >
                                    {translate('restore')}
                                </ButtonWithStatus>
                            </TableCell>
                            {columns.map(({ name }) => (
                                <TableCell
                                    key={data[name] as string}
                                    sx={{
                                        maxHeight: '1rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '200px',
                                    }}
                                >
                                    {data[name] as string}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                onChange={handlePageChange}
                total={total}
                perPage={10}
                currentPage={currentPage}
                texts={{
                    page: translate('page'),
                    perPage: translate('perPage'),
                    showing: translate('showing'),
                }}
            />
        </CardContent>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    loading: fromRemovedResources.isRemovedResourceLoading(state),
    columns: fromFields.getCollectionFields(state),
    currentPage: fromRemovedResources.getRemovedResourceCurrentPage(state),
    resources: fromRemovedResources.getRemovedResourceItems(state),
    total: fromRemovedResources.getRemovedResourceTotal(state),
});

const mapDispatchToProps = {
    loadRemovedResourcePage: loadRemovedResourcePageAction,
    restoreRessource: restoreRessourceAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(RemovedResourceListComponent);
