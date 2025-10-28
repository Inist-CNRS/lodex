import { TableCell } from '@mui/material';
import { connect } from 'react-redux';

import { sortDataset as sortDatasetAction } from './index';
import { fromDataset } from '../selectors';
import SortButton from '../../../../src/app/js/lib/components/SortButton';

type DatasetColumnHeaderProps = {
    name: string;
    label: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    sortDataset(...args: unknown[]): unknown;
};

const DatasetColumnHeader = ({
    name,
    label,
    sortBy,
    sortDir,
    sortDataset,
}: DatasetColumnHeaderProps) => (
    <TableCell>
        {label === 'uri' ? (
            <span>#</span>
        ) : (
            <SortButton
                // @ts-expect-error TS2322
                className={`sort_${name}`}
                sort={sortDataset}
                name={name}
                sortBy={sortBy}
                sortDir={sortDir}
            >
                {label}
            </SortButton>
        )}
    </TableCell>
);

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    ...fromDataset.getSort(state),
});

const mapDispatchToProps = {
    sortDataset: sortDatasetAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DatasetColumnHeader);
