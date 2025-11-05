import pure from 'recompose/pure';
import { TableCell, type SxProps } from '@mui/material';
import {
    isLongText,
    getShortText,
} from '@lodex/frontend-common/utils/longTexts';

interface ParsingExcerptHeaderColumnComponentProps {
    column: string;
    sx?: SxProps;
}

export const ParsingExcerptHeaderColumnComponent = ({
    sx,
    column,
}: ParsingExcerptHeaderColumnComponentProps) => (
    <TableCell
        sx={[
            {
                position: 'relative',
                minWidth: '10rem',
                overflow: 'visible',
                height: '6rem',
            },
            ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
        ]}
        title={isLongText(column) ? column : undefined}
    >
        {isLongText(column) ? getShortText(column) : column}
    </TableCell>
);

export default pure(ParsingExcerptHeaderColumnComponent);
