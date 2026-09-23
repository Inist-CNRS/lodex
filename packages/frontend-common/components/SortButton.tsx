import { Button } from '@mui/material';
import ArrowUp from '@mui/icons-material/ArrowUpward';
import withHandlers from 'recompose/withHandlers';
import { isLongText, getShortText } from '../utils/longTexts';

const styles = {
    sortButton: {
        minWidth: 40,
    },
    iconSortBy: {
        transition: 'transform 100ms ease-in-out',
    },
    ASC: {},
    DESC: {
        transform: 'rotate(180deg)',
    },
};

interface SortButtonProps {
    name: string;
    children: string;
    sortDir?: 'ASC' | 'DESC';
    sortBy?: string;
    sort(...args: unknown[]): unknown;
}

const SortButton = ({
    name,
    children,
    sortBy,
    sortDir,
    sort,
}: SortButtonProps) => (
    <Button
        variant="text"
        // @ts-expect-error TS2769
        color="text"
        className={`sort_${name}`}
        onClick={sort}
        sx={styles.sortButton}
    >
        {isLongText(children) ? getShortText(children) : children}
        {sortBy === name && (
            <ArrowUp
                sx={{
                    ...styles.iconSortBy,
                    // @ts-expect-error TS7053
                    ...styles[sortDir],
                }}
            />
        )}
    </Button>
);

export default withHandlers({
    sort:
        // @ts-expect-error TS7031

        ({ sort, name }) =>
            () =>
                sort(name),
})(SortButton);
