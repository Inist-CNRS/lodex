import { TableRow } from '@mui/material';

import ExcerptLineCol from './ExcerptLineCol';

const styles = {
    row: {
        height: 36,
    },
};

interface ExcerptLineProps {
    columns: {
        name: string;
    }[];
    line: {
        uri: string;
    };
    readonly?: boolean;
}

const ExcerptLine = ({ columns, line, readonly }: ExcerptLineProps) => (
    <TableRow sx={styles.row}>
        {columns.map((col) => (
            <ExcerptLineCol
                key={`${line.uri}_${col.name}`}
                // @ts-expect-error TS2322
                field={col}
                line={line}
                readonly={readonly}
            />
        ))}
    </TableRow>
);

export default ExcerptLine;
